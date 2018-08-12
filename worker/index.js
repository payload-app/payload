const { promisify } = require('util')
const { logger } = require('./logger')
const RPCClient = require('@hharnisc/micro-rpc-client')
const doWork = require('./doWork')
const { broadcastComplete, broadcastCompleteWithDiffs } = require('./broadcast')
const cleanup = require('./cleanup')

const sleep = promisify(setTimeout)
const queueServiceClient = new RPCClient({
  url: 'http://queue-service:3000/rpc',
})
const runServiceClient = new RPCClient({
  url: 'http://run-service:3000/rpc',
})
const workingDirBase = '/home/sandbox'

const queue = process.env.WORKER_QUEUE
const workerName = process.env.WORKER_NAME

const parseWork = ({ work }) => {
  const { task, taskId, lease } = work
  const {
    owner,
    ownerType,
    type,
    repo,
    repoId,
    accessToken,
    taskType,
    maxLease,
    head: { sha: headSha, branch: headBranch },
    base: { sha: baseSha, branch: baseBranch },
  } = task
  return {
    taskId,
    lease,
    maxLease,
    owner,
    ownerType,
    type,
    repo,
    repoId,
    accessToken,
    taskType,
    headSha,
    headBranch,
    baseSha,
    baseBranch,
  }
}

const setupLoggerMetadata = ({ work, logger }) => {
  const {
    taskId,
    owner,
    ownerType,
    repo,
    repoId,
    taskType,
    headSha,
    baseSha,
    headBranch,
    baseBranch,
    lease,
  } = parseWork({ work })
  logger.mergeLoggerMetadata({
    metadata: {
      taskId,
      owner,
      ownerType,
      repo,
      repoId,
      taskType,
      headSha,
      baseSha,
      headBranch,
      baseBranch,
      lease,
    },
  })
}

const setupLeaseExtender = ({ work, logger }) => {
  const { taskId, lease } = parseWork({ work })
  const leaseExtendId = setInterval(async () => {
    logger.info({ message: 'extending lease' })
    try {
      await queueServiceClient.call('extendLease', {
        queue,
        workerName,
        taskId,
      })
    } catch (error) {
      await cleanup({
        workingDirBase,
        logger,
      })
      logger.error({ message: 'could not extend lease, killing worker' })
      process.exit(1)
    }
  }, lease * 1000 / 2)

  return () => clearInterval(leaseExtendId)
}

const doBaseCommitWork = async ({ work, logger }) => {
  const {
    taskId,
    maxLease,
    owner,
    ownerType,
    type,
    repo,
    repoId,
    baseSha,
    baseBranch,
    accessToken,
  } = parseWork({
    work,
  })
  try {
    const { fileSizes } = await doWork({
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
      sha: baseSha,
      branch: baseBranch,
      logger,
      workingDirBase,
      baseRun: true,
      runServiceClient,
      queueServiceClient,
    })
    return { fileSizes, failTask: false, stopProcessing: false }
  } catch (error) {
    return {
      failTask: error.message !== 'Another worker is processing this run',
      stopProcessing: error.message === 'Another worker is processing this run',
      displayable: error.displayable || false,
      error: error.message,
      stack: error.stack,
    }
  }
}

const doHeadCommitWork = async ({ work, logger }) => {
  const {
    taskId,
    maxLease,
    owner,
    ownerType,
    type,
    repo,
    repoId,
    headSha,
    headBranch,
    accessToken,
  } = parseWork({
    work,
  })
  try {
    const { fileSizes, increaseThreshold, assetManifests } = await doWork({
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
      sha: headSha,
      branch: headBranch,
      logger,
      workingDirBase,
      runServiceClient,
      queueServiceClient,
    })
    return {
      fileSizes,
      increaseThreshold,
      assetManifests,
      failTask: false,
      stopProcessing: false,
    }
  } catch (error) {
    return {
      failTask: error.message !== 'Another worker is processing this run',
      stopProcessing: true,
      displayable: error.displayable || false,
      error: error.message,
      stack: error.stack,
    }
  }
}

const handleWork = async ({ work, logger }) => {
  const {
    taskId,
    owner,
    ownerType,
    type,
    repo,
    headSha,
    headBranch,
    accessToken,
    taskType,
  } = parseWork({
    work,
  })
  // TODO: there might be a bug if a base run is re-run and passes
  const {
    fileSizes: baseFileSizes,
    failTask: baseFailTask,
    stopProcessing: baseStopProcessing,
    displayable: baseDisplayable,
    error: baseError,
    stack: baseStack,
  } = await doBaseCommitWork({ work, logger })
  if (baseStopProcessing) {
    logger.warn({
      message: 'error while processing base commit',
      data: {
        error: baseError,
        stack: baseStack,
        failTask: baseFailTask,
        stopProcessing: baseStopProcessing,
        displayable: baseDisplayable,
      },
    })
    if (baseFailTask) {
      await queueServiceClient.call('failTask', {
        queue,
        workerName,
        taskId,
        // if there is an error that can't be displayed
        // it should be dumped into the dead letter queue
        handled: baseDisplayable,
        errorMessage: baseDisplayable ? baseError : baseStack,
      })
    }
    return
  }
  const {
    assetManifests: headAssetManifests,
    fileSizes: headFileSizes,
    increaseThreshold,
    failTask,
    stopProcessing,
    displayable,
    error,
    stack,
  } = await doHeadCommitWork({ work, logger })
  if (stopProcessing) {
    logger.error({
      message: 'error while processing head commit',
      data: {
        error,
        stack,
        failTask,
        stopProcessing,
        displayable,
      },
    })
    if (failTask) {
      await queueServiceClient.call('failTask', {
        queue,
        workerName,
        taskId,
        // if there is an error that can't be displayed
        // it should be dumped into the dead letter queue
        handled: displayable,
        errorMessage: displayable ? error : stack,
      })
    }
    return
  }

  if (headFileSizes && baseFileSizes && taskType === 'pullRequest') {
    await broadcastCompleteWithDiffs({
      baseFileSizes,
      headFileSizes,
      assetManifests: headAssetManifests,
      ownerType,
      type,
      accessToken,
      owner,
      repo,
      branch: headBranch,
      sha: headSha,
      increaseThreshold: increaseThreshold || 0.05,
    })
  } else {
    await broadcastComplete({
      fileSizes: headFileSizes,
      assetManifests: headAssetManifests,
      ownerType,
      type,
      accessToken,
      owner,
      repo,
      branch: headBranch,
      sha: headSha,
    })
  }
  await queueServiceClient.call('completeTask', {
    queue,
    workerName,
    taskId,
  })
}

const main = async () => {
  logger.mergeLoggerMetadata({ metadata: { workerName, queue } })
  logger.info({ message: 'worker checking queue' })
  const work = await queueServiceClient.call('processTask', {
    queue,
    workerName,
  })

  if (work) {
    setupLoggerMetadata({ work, logger })
    logger.info({ message: 'found task' })
    let stopLeaseExtender
    try {
      stopLeaseExtender = setupLeaseExtender({
        work,
        logger,
      })
      await handleWork({ work, logger })
    } catch (error) {
      logger.error({
        message: 'Unhandled Error In Work Handler',
        data: {
          stack: error.stack,
          error: error.message,
        },
      })
    }
    if (stopLeaseExtender) {
      stopLeaseExtender()
    }
    cleanup({ workingDirBase, logger, resetLoggerMetadata: true })
  } else {
    logger.info({ message: 'No Task Found' })
  }
  logger.info({ message: 'Sleeping 10 Seconds' })
  await sleep(10000)
}

const controlLoop = async () => {
  try {
    await main()
  } catch (error) {
    logger.error({
      message: 'Uncaught Error In Main',
      data: {
        stack: error.stack,
        error: error.message,
      },
    })
  }
  await controlLoop()
}

controlLoop()
