const winston = require('winston')
const { promisify } = require('util')
const RPCClient = require('@hharnisc/micro-rpc-client')
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
    logger.info(`Found Task: ${taskId}`)
    logger.info(JSON.stringify(task))
    logger.info('doing fake work for 10 seconds')
    await sleep(10000) // 10 seconds
    const result = await queueServiceClient.call('completeTask', {
      queue,
      workerName,
      taskId,
    })
    logger.info(`Completed Task ${taskId} - ${JSON.stringify(result)}`)
  } else {
    logger.info(`No Task Found On Queue ${queue}`)
  }

  logger.info(`Sleeping 60 Seconds`)
  await sleep(60000)
}

main()
