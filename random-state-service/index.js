const Redis = require('ioredis')
const { rpc, method } = require('@hharnisc/micro-rpc')
const { router, get, post } = require('microrouter')
const { send } = require('micro')
const createState = require('./createState')
const validateState = require('./validateState')
const deleteState = require('./deleteState')

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
})

const rpcHandler = rpc(
  method('createState', createState({ redisClient })),
  method('validateState', validateState({ redisClient })),
  method('deleteState', deleteState({ redisClient })),
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
