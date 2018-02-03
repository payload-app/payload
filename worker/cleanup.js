const { join } = require('path')
const { promisify } = require('util')
const rimraf = require('rimraf')
const rmrf = promisify(rimraf)

module.exports = async ({ sha, workingDirBase = '/tmp' }) => {
  await rmrf(join(workingDirBase, sha))
}
