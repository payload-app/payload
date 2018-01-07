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
  method('listRepos', () => 'OK'),
  method('activateRepo', () => 'OK'),
  method('deactivateRepo', () => 'OK'),
)

const healthHandler = () => ({
  status: 'OK',
})

module.exports = router(
  get('/healthz', healthHandler),
  post('/rpc', rpcHandler),
)
