const { readFile: readFileAsync, stat: statAsync } = require('fs')
const { join } = require('path')
const { promisify } = require('util')
const { spawn } = require('child-process-promise')

const readFile = promisify(readFileAsync)
const stat = promisify(statAsync)

const getFilesizeInBytes = async filename => {
  const stats = await stat(filename)
  const fileSizeInBytes = stats.size
  return fileSizeInBytes
}

module.exports = async ({ sha, logger, workingDirBase = '/tmp' }) => {
  logger.info('Reading package.json file')
  const fileData = await readFile(join(workingDirBase, sha, 'package.json'))
  logger.info('Parsing package.json file')
  const packageData = JSON.parse(fileData)

  console.log('packageData', packageData)

  // TODO: validate package
  for (let command of packageData.payload.scripts) {
    const promise = spawn(command, {
      shell: true,
      cwd: join(workingDirBase, sha),
    })
    const { childProcess } = promise

    logger.info(`[${command}] pid: `, childProcess.pid)
    childProcess.stdout.on('data', data => {
      logger.info(`[${command}] stdout: `, data.toString())
    })
    childProcess.stderr.on('data', data => {
      logger.info(`[${command}] stderr: `, data.toString())
    })
    await promise
    logger.info(`[${command}] complete`)
  }

  logger.info('Calculating File Sizes')
  for (let file of packageData.payload.files) {
    const fileSize = await getFilesizeInBytes(join(workingDirBase, sha, file))
    logger.info(`[${file}]: `, fileSize)
  }
}
