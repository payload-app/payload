const { promisify } = require('util')
const RPCClient = require('@hharnisc/micro-rpc-client')
const { logger } = require('./logger')
const doWork = require('./doWork')
const { broadcastComplete, broadcastCompleteWithDiffs } = require('./broadcast')
const cleanup = require('./cleanup')

const sleep = promisify(setTimeout)

const queueServiceClient = new RPCClient({
  url: 'http://queue-service:3000/rpc',
})

const workingDirBase = '/home/sandbox'

const main = async () => {
  let leaseExtendId
  let timeoutId
  const queue = process.env.WORKER_QUEUE
  const workerName = process.env.WORKER_NAME
  logger.mergeLoggerMetadata({ metadata: { workerName, queue } })
  logger.info({ message: 'worker checking queue' })

  const work = await queueServiceClient.call('processTask', {
    queue,
    workerName,
  })

  if (work) {
    const { task, taskId, lease } = work
    const {
      owner,
      ownerType,
      type,
      repo,
      repoId,
      accessToken,
      taskType,
      head: { sha: headSha, branch: headBranch },
      base: { sha: baseSha, branch: baseBranch },
    } = task
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
    logger.info({ message: 'found task' })

    leaseExtendId = setInterval(async () => {
      logger.info({ message: 'extending lease' })
      try {
        await queueServiceClient.call('extendLease', {
          queue,
          workerName,
          taskId,
        })
      } catch (error) {
        logger.error({
          message: 'error extending lease',
          data: {
            error: error.message,
            stack: error.stack,
          },
        })
        // if the lease was lost, exit the process
        if (error.message === 'could not find existing lease') {
          return
          // process.exit(2)
        }
      }
    }, lease * 1000 / 2)

    timeoutId = setTimeout(async () => {
      logger.error({ message: 'worker max lease expired' })
      try {
        await queueServiceClient.call('failTask', {
          queue,
          workerName,
          taskId,
          handled: true,
          errorMessage: `Worker lease expired - ${task.maxLease}`,
        })
      } catch (error) {
        logger.error({
          message: 'error failing timed out task',
          data: {
            error: error.message,
            stack: error.stack,
          },
        })
      }
      // process.exit(1)
    }, task.maxLease * 1000)

    // use these to calculate github status
    let baseFileSizes
    let headFileSizes

    try {
      const { fileSizes } = await doWork({
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
      })
      baseFileSizes = fileSizes
    } catch (error) {
      logger.warn({
        message: 'error while processing base',
        data: {
          error: error.message,
          stack: error.stack,
        },
      })
      if (error.message === 'Another worker is processing this run') {
        // process.exit(0)
      }
    }

    try {
      const { fileSizes, increaseThreshold: threshold } = await doWork({
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
      })
      headFileSizes = fileSizes
      increaseThreshold = threshold
    } catch (error) {
      if (error.message === 'Another worker is processing this run') {
        logger.warn({ message: 'another worker is processing this run' })
      } else {
        logger.error({
          message: 'error while processing head',
          data: {
            error: error.message,
            stack: error.stack,
          },
        })
        // if this failed and no other working is processing this run
        // mark the task as failed
        await queueServiceClient.call('failTask', {
          queue,
          workerName,
          taskId,
          // if there is an error that can't be displayed
          // it should be dumped into the dead letter queue
          handled: error.displayable || false,
          errorMessage: error.displayable ? error.message : error.stack,
        })
      }
      // let the task expire since another worker is processing this run
      // process.exit(0)
    }

    if (headFileSizes && baseFileSizes && taskType === 'pullRequest') {
      await broadcastCompleteWithDiffs({
        baseFileSizes,
        headFileSizes,
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
  } else {
    logger.info({ message: 'No Task Found' })
  }
  if (leaseExtendId) {
    clearInterval(leaseExtendId)
  }
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  cleanup({ workingDirBase, logger })
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
    process.exit(1)
  }
  await controlLoop()
}

controlLoop()
