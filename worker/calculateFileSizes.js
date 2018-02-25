const { stat: statAsync } = require('fs')
const { join } = require('path')
const { promisify } = require('util')
const { throwDisplayableError } = require('./utils')

const stat = promisify(statAsync)

const getFilesizeInBytes = async filename => {
  const stats = await stat(filename)
  const fileSizeInBytes = stats.size
  return fileSizeInBytes
}

module.exports = async ({ sha, files, logger, workingDirBase }) => {
  const fileSizes = []
  for (let file of files) {
    let size
    try {
      size = await getFilesizeInBytes(join(workingDirBase, sha, file))
    } catch (err) {
      throwDisplayableError({
        message: `Could not calulate size of file: ${file}`,
      })
    }

    logger.info({
      message: 'calculated file size',
      data: {
        file,
        size,
      },
    })
    fileSizes.push({ file, size })
  }
  return fileSizes
}
