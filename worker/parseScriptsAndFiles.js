const { readFile: readFileAsync } = require('fs')
const { join } = require('path')
const { promisify } = require('util')

const readFile = promisify(readFileAsync)

module.exports = async ({ sha, logger, workingDirBase }) => {
  logger.info('Reading package.json file')
  const fileData = await readFile(join(workingDirBase, sha, 'package.json'))
  logger.info('Parsing package.json file')
  const packageData = JSON.parse(fileData)

  return {
    scripts: packageData.payload.scripts,
    files: packageData.payload.files,
  }
}
