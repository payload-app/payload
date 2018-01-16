const Redis = require('ioredis')
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

const rpcHandler = rpc(
  method('createTask', () => 'OK'),
  method('processTask', () => 'OK'),
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
