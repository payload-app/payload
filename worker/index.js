require('dotenv').config()
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
    const { task, taskId } = work
    logger.info('Found Task', { taskId, task })

    const {
      owner,
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
      const { fileSizes, runId } = await doWork({
        owner,
        repo,
        repoId,
        accessToken,
        sha: baseSha,
        branch: baseBranch,
        logger,
      })
      baseFileSizes = fileSizes
      baseRunId = runId
    } catch (error) {
      if (error.message === 'Another worker is processing this run') {
        return
      }
    }

    try {
      const { fileSizes, increaseThreshold: threshold, runId } = await doWork({
        owner,
        repo,
        repoId,
        accessToken,
        sha: headSha,
        branch: headBranch,
        logger,
      })
      headRunId = runId
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
        })
      }
      // let the task expire since another worker is processing this run
      return
    }

    if (headFileSizes && baseFileSizes && taskType === 'pullRequest') {
      await broadcastCompleteWithDiffs({
        baseFileSizes,
        headFileSizes,
        runId: headRunId,
        accessToken,
        owner,
        repo,
        sha: headSha,
        increaseThreshold: increaseThreshold || 0.05,
      })
    } else {
      await broadcastComplete({
        fileSizes: headFileSizes,
        runId: headRunId,
        accessToken,
        owner,
        repo,
        sha: headSha,
      })
    }

    await queueServiceClient.call('completeTask', {
      queue,
      workerName,
      taskId,
    })
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
