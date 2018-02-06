const winston = require('winston')
const { promisify } = require('util')
const RPCClient = require('@hharnisc/micro-rpc-client')
const doWork = require('./doWork')

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
      head: { sha: headSha, branch: headBranch },
      base: { sha: baseSha, branch: baseBranch },
    } = task

    // use these to calculate github status
    let baseFileSizes
    let headFileSizes

    try {
      baseFileSizes = await doWork({
        owner,
        repo,
        repoId,
        accessToken,
        sha: baseSha,
        branch: baseBranch,
        logger,
      })
    } catch (error) {
      if (error.message === 'Another worker is processing this run') {
        return
      }
      console.log(error)
    }

    try {
      headFileSizes = await doWork({
        owner,
        repo,
        repoId,
        accessToken,
        sha: headSha,
        branch: headBranch,
        logger,
      })
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

    console.log('baseFileSizes', baseFileSizes)
    console.log('headFileSizes', headFileSizes)

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

try {
  main()
} catch (error) {
  console.log('error', error)
  logger.info('Caught Unhandled Error In Main', error)
}
