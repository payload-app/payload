// @flow
import type { listReposMethodType } from 'payload-api-types'

const {
  rpc,
  method
} = require('@hharnisc/micro-rpc')
const {
  router,
  get,
  post,
} = require('microrouter')
const cors = require('micro-cors');
const listReposFixture = require('./fixtures/listRepos')

const listRepos: listReposMethodType = () => listReposFixture
const rpcHandler = rpc(
  method('listRepos', listRepos),
  method('activateRepo', () => 'OK'),
  method('deactivateRepo', () => 'OK'),
)

const healthHandler = () => ({
  status: 'OK',
})

module.exports = router(
  get('/healthz', healthHandler),
  cors()(post('/rpc', rpcHandler)), // TODO: set origin in production
)
