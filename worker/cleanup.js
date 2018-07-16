const { join } = require('path')
const { promisify } = require('util')
const rimraf = require('rimraf')
const rmrf = promisify(rimraf)

module.exports = async ({ sha, workingDirBase, logger }) => {
  if (sha) {
    await rmrf(join(workingDirBase, sha))
  } else {
    await rmrf(`${workingDirBase}/*`)
  }
  logger.resetLoggerMetadata()
}
