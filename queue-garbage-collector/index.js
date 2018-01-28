const { promisify } = require('util')
const RPCClient = require('@hharnisc/micro-rpc-client')
const sleep = promisify(setTimeout)

const queueServiceClient = new RPCClient({
  url: 'http://queue-service:3000/rpc',
})

const main = async () => {
  const queue = process.env.WORKER_QUEUE
  const sleepTime = process.env.SLEEP_AFTER_COLLECT
    ? parseInt(process.env.SLEEP_AFTER_COLLECT)
    : 0
  console.log(`Collecting Garbage On Queue ${queue}`)
  const { cleanedTaskIds } = await queueServiceClient.call('garbageCollect', {
    queue,
  })
  if (cleanedTaskIds.length) {
    console.log(
      `Cleaned ${cleanedTaskIds.length} tasks: ${JSON.stringify(
        cleanedTaskIds,
      )}`,
    )
  }

  if (sleepTime) {
    console.log(`Sleeping For ${sleepTime} seconds`)
    await sleep(sleepTime * 1000)
  }
}

main()
