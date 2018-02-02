// @flow
import type { RepoList } from 'api-types'
const { rpc, method } = require('@hharnisc/micro-rpc')
const { router, get, post } = require('microrouter')
const RPCClient = require('@hharnisc/micro-rpc-client')
const setSession = require('./setSession')
const listReposFixture = require('./fixtures/listRepos')
const listGithubRepos = require('./listGithubRepos')

const githubServiceClient = new RPCClient({
  url: 'http://github-service:3000/rpc',
})

const rpcHandler = setSession(
  rpc(
    method('listRepos', (): RepoList => listReposFixture),
    method('listGithubRepos', listGithubRepos({ githubServiceClient })),
    method('activateRepo', () => 'OK'),
    method('deactivateRepo', () => 'OK'),
  ),
)

const healthHandler = () => ({
  status: 'OK',
})

module.exports = router(
  get('/api/healthz', healthHandler),
  post('/api/rpc', rpcHandler),
)
