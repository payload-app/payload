const parsePayloadConfig = require('./parsePayloadConfig')
const runScripts = require('./runScripts')
const calculateFileSizes = require('./calculateFileSizes')
const cloneRepo = require('./cloneRepo')
const cleanup = require('./cleanup')
const {
  broadcastStart,
  broadcastFail,
  broadcastRunError,
} = require('./broadcast')
const setupWorkerTimeout = require('./setupWorkerTimeout')

module.exports = async ({
  taskId,
  maxLease,
  queue,
  workerName,
  owner,
  ownerType,
  type,
  repo,
  repoId,
  accessToken,
  sha,
  branch,
  logger,
  baseRun,
  workingDirBase = '/home/sandbox',
  username = 'sandbox',
  runServiceClient,
  queueServiceClient,
}) => {
  logger.info({ message: 'checking for existing run' })
  let run
  try {
    run = await runServiceClient.call('getRun', {
      owner,
      repo,
      sha,
    })
  } catch (error) {
    logger.info({ message: 'no existing run found' })
  }

  if (run && run.start && !run.stop) {
    const message = 'Another worker is processing this run'
    logger.mergeLoggerMetadata({ metadata: { runId: run._id } })
    logger.info({ message: message.toLowerCase() })
    throw new Error(message)
    // allow failed runs to be tried again
    // allow base runs to return existing data
  } else if (run && !run.errorMessage && baseRun) {
    logger.mergeLoggerMetadata({ metadata: { runId: run._id } })
    logger.info({
      message: 'returning existing run data',
    })
    return {
      fileSizes: run.fileSizes,
    }
  }

  let id
  if (!run) {
    const { id: runId } = await runServiceClient.call('createRun', {
      owner,
      repo,
      repoId,
      branch,
      sha,
    })
    id = runId
  } else {
    id = run._id
  }

  logger.mergeLoggerMetadata({ metadata: { runId: id } })
  logger.info({ message: 'run starting' })
  await runServiceClient.call('startRun', {
    id,
  })
  const stopWorkerTimemout = setupWorkerTimeout({
    taskId,
    maxLease,
    queue,
    workerName,
    logger,
    runId: id,
    accessToken,
    owner,
    repo,
    branch,
    sha,
    ownerType,
    type,
    workingDirBase,
    queueServiceClient,
    runServiceClient,
  })

  let error
  let fileSizes
  let fileList
  let assetManifests
  let increaseThreshold
  try {
    await cloneRepo({
      owner,
      repo,
      sha,
      accessToken,
      logger,
      workingDirBase,
      username,
    })
    const {
      scripts,
      files,
      increaseThreshold: threshold,
      assetManifests: assetManifestsList,
    } = await parsePayloadConfig({
      sha,
      logger,
      workingDirBase,
    })

    increaseThreshold = threshold
    fileList = files
    assetManifests = assetManifestsList

    await broadcastStart({
      files,
      assetManifests,
      accessToken,
      owner,
      repo,
      branch,
      sha,
      ownerType,
      type,
    })

    await runScripts({ scripts, sha, logger, workingDirBase, username })
    fileSizes = await calculateFileSizes({
      sha,
      assetManifests,
      files,
      logger,
      workingDirBase,
    })
    await runServiceClient.call('stopRun', {
      id,
      fileSizes,
    })
    logger.info({ message: 'run complete' })
  } catch (e) {
    const { displayable, message: errorMessage } = e
    const defaultErrorMessage = 'An Unexpected Error Occured'
    error = e
    await runServiceClient.call('stopRun', {
      id,
      errorMessage: displayable ? errorMessage : defaultErrorMessage,
    })
    if (fileList || assetManifests) {
      await broadcastFail({
        assetManifests,
        files: fileList,
        accessToken,
        owner,
        repo,
        branch,
        sha,
        ownerType,
        type,
        errorMessage: displayable ? errorMessage : defaultErrorMessage,
      })
    } else {
      await broadcastRunError({
        accessToken,
        owner,
        repo,
        branch,
        sha,
        ownerType,
        type,
        errorMessage: displayable ? errorMessage : defaultErrorMessage,
      })
    }
  }
  // stop worker timeout so it doesn't kill the worker
  stopWorkerTimemout()
  await cleanup({
    sha,
    workingDirBase,
    logger,
  })
  if (error) {
    throw error
  }
  return {
    fileSizes,
    increaseThreshold,
    assetManifests,
  }
}
