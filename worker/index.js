const winston = require('winston')
const { promisify } = require('util')
const RPCClient = require('@hharnisc/micro-rpc-client')
const doWork = require('./doWork')
const { broadcastComplete, broadcastCompleteWithDiffs } = require('./broadcast')

const sleep = promisify(setTimeout)

const logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: './worker.log',
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false,
    }),
    new winston.transports.Console({
      level: 'debug',
      json: false,
      colorize: true,
    }),
  ],
  exitOnError: false,
})

const queueServiceClient = new RPCClient({
  url: 'http://queue-service:3000/rpc',
})

const main = async () => {
  const queue = process.env.WORKER_QUEUE
  const workerName = process.env.WORKER_NAME
  logger.info(`Worker ${workerName} Checking Queue ${queue}`)

  const work = await queueServiceClient.call('processTask', {
    queue,
    workerName,
  })

  if (work) {
    const { task, taskId, lease } = work
    logger.info('Found Task', { taskId, task, lease })

    const leaseExtendId = setInterval(async () => {
      logger.info('Extending Lease', { taskId, task })
      try {
        await queueServiceClient.call('extendLease', {
          queue,
          workerName,
          taskId,
        })
      } catch (err) {
        // if the lease was lost, exit the process
        if (err.message === 'could not find existing lease') {
          process.exit(2)
        }
      }
    }, lease * 1000 / 2)

    const timeoutId = setTimeout(async () => {
      logger.info('Worker Max Lease Expired', { taskId, task })
      await queueServiceClient.call('failTask', {
        queue,
        workerName,
        taskId,
        handled: true,
        errorMessage: `Worker lease expired - ${task.maxLease}`,
      })
      process.exit(1)
    }, task.maxLease * 1000)

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
      })
      baseFileSizes = fileSizes
    } catch (error) {
      if (error.message === 'Another worker is processing this run') {
        process.exit(0)
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
      })
      headFileSizes = fileSizes
      increaseThreshold = threshold
    } catch (error) {
      // if this failed and no other working is processing this run
      // mark the task as failed
      if (error.message !== 'Another worker is processing this run') {
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
      process.exit(0)
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
    clearInterval(leaseExtendId)
    clearTimeout(timeoutId)
  } else {
    logger.info('No Task Found', { queue })
  }

  logger.info('Sleeping 10 Seconds')
  await sleep(10000)
}

main().catch(error => {
  console.log('error', error)
  logger.info('Caught Unhandled Error In Main', error)
})
