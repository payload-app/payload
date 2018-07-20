const { stat: statAsync, readFile: readFileAsync } = require('fs')
const { join } = require('path')
const { promisify } = require('util')
const { throwDisplayableError } = require('./utils')

const stat = promisify(statAsync)
const readFile = promisify(readFileAsync)

const getFilesizeInBytes = async filename => {
  const stats = await stat(filename)
  const fileSizeInBytes = stats.size
  return fileSizeInBytes
}

const calculateFileSizes = async ({ files, workingDirBase, sha, logger }) => {
  const fileSizes = []
  for (let file of files) {
    const { fileName, filePath } = file
    let size
    try {
      size = await getFilesizeInBytes(join(workingDirBase, sha, filePath))
    } catch (error) {
      throwDisplayableError({
        message: `Could not calulate size of file: ${fileName} - ${filePath}`,
      })
    }

    logger.info({
      message: 'calculated file size',
      data: {
        filePath,
        fileName,
        size,
      },
    })
    fileSizes.push({ file: fileName, size })
  }
  return fileSizes
}

// new files wins
const mergeFileSizes = ({ currentFiles, newFiles }) => {
  const seenFiles = new Set()
  return [...newFiles, ...currentFiles].filter(file => {
    if (!seenFiles.has(file)) {
      seenFiles.add(file)
      return true
    }
    return false
  })
}

module.exports = async ({
  sha,
  assetManifests,
  files,
  logger,
  workingDirBase,
}) => {
  let fileSizes = []
  // asset manifest paths are (typically) relative to the asset manifest
  for (let assetManifest of assetManifests) {
    logger.info({ message: `reading asset manifest ${assetManifest}` })
    let fileData
    try {
      fileData = await readFile(join(workingDirBase, sha, assetManifest))
    } catch (error) {
      throwDisplayableError({
        message: `Could not find asset manifest ${assetManifest}`,
      })
    }
    logger.info({ message: `parsing asset manifest ${assetManifest}` })
    let assetManifestData
    try {
      assetManifestData = JSON.parse(fileData)
    } catch (err) {
      throwDisplayableError({
        message: 'Could not parse asset manifest ${assetManifest}',
      })
    }
    const assetManifestFiles = []
    for (let fileName in assetManifestData) {
      let filePath = assetManifestData[fileName]

      // if the manifest is not already a relative path, and the asset manifest file is in another directory, prepend the asset manifest directory
      if (!filePath.startsWith('.') && assetManifest.includes('/')) {
        filePath = join(
          assetManifest.substring(0, assetManifest.lastIndexOf('/')),
          filePath,
        )
      }
      assetManifestFiles.push({
        fileName: `${assetManifest}:${fileName}`,
        filePath,
      })
    }
    fileSizes = mergeFileSizes({
      currentFiles: fileSizes,
      newFiles: await calculateFileSizes({
        files: assetManifestFiles,
        workingDirBase,
        sha,
        logger,
      }),
    })
  }

  // merge files speficically called list (writes over asset manifest files)
  fileSizes = mergeFileSizes({
    currentFiles: fileSizes,
    newFiles: await calculateFileSizes({
      files: files.map(file => ({
        fileName: file,
        filePath: file,
      })),
      workingDirBase,
      sha,
      logger,
    }),
  })
  return fileSizes
}
