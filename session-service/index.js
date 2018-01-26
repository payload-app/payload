const { rpc, method } = require('@hharnisc/micro-rpc')
const { router, get, post } = require('microrouter')
const createSession = require('./createSession')
const getSession = require('./getSession')

const rpcHandler = rpc(
  method('createSession', createSession),
  method('getSession', getSession),
)

const healthHandler = () => 'OK'

module.exports = router(
  get('/healthz', healthHandler),
  post('/rpc', rpcHandler),
)
