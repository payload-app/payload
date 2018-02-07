const { stat: statAsync } = require('fs')
const { join } = require('path')
const { promisify } = require('util')

const stat = promisify(statAsync)

const getFilesizeInBytes = async filename => {
  const stats = await stat(filename)
  const fileSizeInBytes = stats.size
  return fileSizeInBytes
}

module.exports = async ({ sha, files, logger, workingDirBase }) => {
  const fileSizes = []
  for (let file of files) {
    const size = await getFilesizeInBytes(join(workingDirBase, sha, file))
    logger.info('calculated file size', {
      file,
      size,
    })
    fileSizes.push({ file, size })
  }
  return fileSizes
}
