const { rpc, method } = require('@hharnisc/micro-rpc')
const { router, get, post } = require('microrouter')
const createSession = require('./createSession')

const rpcHandler = rpc(method('createSession', createSession))

const healthHandler = () => 'OK'

module.exports = router(
  get('/healthz', healthHandler),
  post('/rpc', rpcHandler),
)
