const Redis = require('ioredis')
const { rpc, method } = require('@hharnisc/micro-rpc')
const { router, get, post } = require('microrouter')
const { send } = require('micro')
const completeTask = require('./completeTask')
const createTask = require('./createTask')
const processTask = require('./processTask')
const extendLease = require('./extendLease')
const failTask = require('./failTask')
const garbageCollect = require('./garbageCollect')
const requeueTask = require('./requeueTask')

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
})

const rpcHandler = rpc(
  method('createTask', createTask({ redisClient })),
  method('processTask', processTask({ redisClient })),
  method('extendLease', extendLease({ redisClient })),
  method('requeueTask', requeueTask({ redisClient })),
  method('failTask', failTask({ redisClient })),
  method('completeTask', completeTask({ redisClient })),
  method('garbageCollect', garbageCollect({ redisClient })),
)

const healthHandler = async (req, res) => {
  try {
    await redisClient.ping()
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
