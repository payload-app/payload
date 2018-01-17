const Redis = require('ioredis')
const { sha256 } = require('js-sha256')
const {
  rpc,
  method
} = require('@hharnisc/micro-rpc')
const {
  router,
  get,
  post,
} = require('microrouter')
const { send } = require('micro');

const redis = new Redis({
  host: 'redis',
  port: 6379
})

const leasedKey = ({
  queue,
  item,
}) => {
  const itemKey =
    sha256
      .create()
      .update(item)
      .hex()
  return `${queue}:leased:${itemKey}`
}

const processingQueue = ({
  queue
}) =>
  `${queue}:processing`

const workerName = () => process.env.WORKER_NAME || 'worker'

const rpcHandler = rpc(
  method('createTask', ({
    queue,
    task,
    retries=0,
    lease=60, // seconds
  }) =>
    redis.lpush(queue, JSON.stringify({
      task,
      retries,
      lease,
    }))),
  method('processTask', async ({
    queue,
  }) => {
    const item = await redis.rpoplpush(
      queue,
      processingQueue({ queue })
    )
    if (item) {
      const { lease } = JSON.parse(item)
      redis.setex(leasedKey({ queue, item }), lease, workerName())
    }
    return JSON.parse(item)
  }),
  method('failTask', () => 'OK'),
  method('completeTask', () => 'OK'),
)

const healthHandler = async (req, res) => {
  try {
    await redis.ping()
    send(res, 200, { status: 'OK' })
  } catch (err) {
    send(res, 500, {
      status: 'cannot reach redis',
    })
  }
}

module.exports = router(
  get('/healthz', healthHandler),
  post('/rpc', rpcHandler),
)
