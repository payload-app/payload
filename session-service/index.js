const { rpc, method } = require('@hharnisc/micro-rpc')
const { router, get, post } = require('microrouter')
const createSession = require('./createSession')
const getSession = require('./getSession')
const destroySession = require('./destroySession')

const rpcHandler = rpc(
  method('createSession', createSession),
  method('getSession', getSession),
  method('destroySession', destroySession),
)

const healthHandler = () => 'OK'

module.exports = router(
  get('/healthz', healthHandler),
  post('/rpc', rpcHandler),
)
