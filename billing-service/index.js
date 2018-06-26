const { router, get, post } = require('microrouter')
const { rpc, method } = require('@hharnisc/micro-rpc')
const startTrial = require('./startTrial')

const rpcHandler = rpc(method('startTrial', startTrial))

const healthHandler = () => 'OK'

module.exports = router(
  get('/healthz', healthHandler),
  post('/rpc', rpcHandler),
)
