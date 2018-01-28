const { promisify } = require('util')
const RPCClient = require('@hharnisc/micro-rpc-client')
const sleep = promisify(setTimeout)

const queueServiceClient = new RPCClient({
  url: 'http://queue-service:3000/rpc',
})

const main = async () => {
  const queue = process.env.WORKER_QUEUE
  const workerName = process.env.WORKER_NAME
  console.log(`Worker ${workerName} Checking Queue ${queue}`)

  const work = await queueServiceClient.call('processTask', {
    queue,
    workerName,
  })

  if (work) {
    const { task, taskId } = work
    console.log('***')
    console.log(`Found Task: ${taskId}`)
    console.log(JSON.stringify(task))
    console.log('***')
    console.log('doing fake work for 10 seconds')
    await sleep(10000) // 10 seconds
    const result = await queueServiceClient.call('completeTask', {
      queue,
      workerName,
      taskId,
    })
    console.log(`Completed Task ${taskId} - ${JSON.stringify(result)}`)
  } else {
    console.log(`No Task Found On Queue ${queue}`)
  }

  console.log(`Sleeping 10 Seconds`)
  await sleep(10000)
}

main()
