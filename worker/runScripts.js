const { join } = require('path')
const { spawn } = require('child-process-promise')

module.exports = async ({ scripts, sha, logger, workingDirBase }) => {
  for (let script of scripts) {
    const promise = spawn(script, {
      shell: true,
      cwd: join(workingDirBase, sha),
    })
    const { childProcess } = promise
    logger.info('Script starting', {
      pid: childProcess.pid,
      script,
    })

    childProcess.stdout.on('data', data => {
      logger.info('Script stdout', {
        pid: childProcess.pid,
        script,
        data: data.toString(),
      })
    })
    childProcess.stderr.on('data', data => {
      logger.info('Script stderr', {
        pid: childProcess.pid,
        script,
        data: data.toString(),
      })
    })
    await promise
    logger.info('Script complete', {
      pid: childProcess.pid,
      script,
    })
  }
}
