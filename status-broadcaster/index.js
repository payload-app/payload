const {
  rpc,
  method
} = require('@hharnisc/micro-rpc')
const {
  router,
  get,
  post,
} = require('microrouter')

const rpcHandler = rpc(
  method('broadcastStatus', () => 'OK'),
)

const healthHandler = () => ({
  status: 'OK',
})

module.exports = router(
  get('/healthz', healthHandler),
  post('/rpc', rpcHandler),
)
