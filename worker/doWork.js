const RPCClient = require('@hharnisc/micro-rpc-client')
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

const runServiceClient = new RPCClient({
  url: 'http://run-service:3000/rpc',
})

module.exports = async ({
  owner,
  ownerType,
  type,
  repo,
  repoId,
  accessToken,
  sha,
  branch,
  logger,
  workingDirBase = '/tmp',
}) => {
  logger.info('Checking for existing run')
  let run
  try {
    run = await runServiceClient.call('getRun', {
      owner,
      repo,
      sha,
    })
  } catch (error) {}

  if (run && run.start && !run.stop) {
    const message = 'Another worker is processing this run'
    logger.info(message, { run })
    throw new Error(message)
    // allow failed runs to be tried again
  } else if (run && !run.errorMessage) {
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

  logger.info('Run Starting', { id })
  await runServiceClient.call('startRun', {
    id,
  })

  let error
  let fileSizes
  let fileList
  let increaseThreshold
  try {
    await cloneRepo({
      owner,
      repo,
      sha,
      accessToken,
      logger,
    })
    const {
      scripts,
      files,
      increaseThreshold: threshold,
    } = await parsePayloadConfig({
      sha,
      logger,
      workingDirBase,
    })

    increaseThreshold = threshold
    fileList = files

    await broadcastStart({
      files,
      accessToken,
      owner,
      repo,
      branch,
      sha,
      ownerType,
      type,
    })

    await runScripts({ scripts, sha, logger, workingDirBase })
    fileSizes = await calculateFileSizes({ sha, files, logger, workingDirBase })
    await runServiceClient.call('stopRun', {
      id,
      fileSizes,
    })
    logger.info('Run Complete', { id })
  } catch (e) {
    const { displayable, message: errorMessage } = e
    const defaultErrorMessage = 'An Unexpected Error Occured'
    error = e
    logger.info('Run Failed', { id, error: errorMessage })
    await runServiceClient.call('stopRun', {
      id,
      errorMessage: displayable ? errorMessage : defaultErrorMessage,
    })
    if (fileList) {
      await broadcastFail({
        files,
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
      broadcastRunError({
        accessToken,
        owner,
        repo,
        branch,
        sha,
        ownerType,
        type,
        errorMessage: displayable
          ? errorMessage
          : 'An Unexpected Error Occured',
      })
    }
  }
  await cleanup({
    sha,
  })
  if (error) {
    throw error
  }
  return {
    fileSizes,
    increaseThreshold,
  }
}
