const { readFile: readFileAsync } = require('fs')
const { join } = require('path')
const { promisify } = require('util')
const { throwDisplayableError } = require('./utils')

const readFile = promisify(readFileAsync)

module.exports = async ({ sha, logger, workingDirBase }) => {
  logger.info({ message: 'reading package.json file' })
  let fileData
  try {
    fileData = await readFile(join(workingDirBase, sha, 'package.json'))
  } catch (err) {
    throwDisplayableError({ message: 'Could not find package.json' })
  }

  logger.info({ message: 'parsing package.json file' })
  let packageData
  try {
    packageData = JSON.parse(fileData)
  } catch (err) {
    throwDisplayableError({ message: 'Could not parse package.json' })
  }
  if (!packageData.payload) {
    throwDisplayableError({
      message: '"payload" key was not found in package.json',
    })
  }
  if (!packageData.payload.scripts) {
    throwDisplayableError({
      message: '"payload.scripts" key was not found in package.json',
    })
  }
  if (!packageData.payload.files) {
    throwDisplayableError({
      message: '"payload.files" key was not found in package.json',
    })
  }
  return {
    scripts: packageData.payload.scripts,
    files: packageData.payload.files,
    increaseThreshold: packageData.payload.increaseThreshold,
  }
}
