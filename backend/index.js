// @flow
import type {
  listReposMethodType,
  activateRepoMethodType,
  deactivateRepoMethodType
} from 'payload-api-types'

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
const activateRepo: activateRepoMethodType = () => 'OK'
const deactivateRepo: deactivateRepoMethodType = () => 'OK'
const rpcHandler = rpc(
  method('listRepos', listRepos),
  method('activateRepo', activateRepo),
  method('deactivateRepo', deactivateRepo),
)

const healthHandler = () => ({
  status: 'OK',
})

module.exports = router(
  get('/healthz', healthHandler),
  cors()(post('/rpc', rpcHandler)), // TODO: set origin in production
)
