const { join } = require('path')
const { spawn, exec } = require('child-process-promise')
const { throwDisplayableError } = require('./utils')

const userId = async ({ username }) => {
  const { stdout } = await exec(`id -u ${username}`)
  return parseInt(stdout)
}

module.exports = async ({ scripts, sha, logger, workingDirBase, username }) => {
  for (let script of scripts) {
    const uid = await userId({ username })
    const promise = spawn(script, {
      shell: '/bin/bash',
      cwd: join(workingDirBase, sha),
      env: {
        PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
      },
      uid,
    })
    const { childProcess } = promise
    logger.info({
      message: 'script starting',
      data: {
        pid: childProcess.pid,
        script,
      },
    })

    childProcess.stdout.on('data', data => {
      logger.info({
        message: 'script stdout',
        data: {
          pid: childProcess.pid,
          script,
          data: data.toString(),
        },
      })
    })
    childProcess.stderr.on('data', data => {
      logger.info({
        message: 'script stderr',
        data: {
          pid: childProcess.pid,
          script,
          data: data.toString(),
        },
      })
    })
    try {
      await promise
    } catch (err) {
      throwDisplayableError({
        message: `Script Error: ${script} - ${err.message}`,
      })
    }

    logger.info({
      message: 'script complete',
      data: {
        pid: childProcess.pid,
        script,
      },
    })
  }
}
