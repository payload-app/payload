// @flow
import type { RepoList } from 'api-types'
const { rpc, method } = require('@hharnisc/micro-rpc')
const { router, get, post } = require('microrouter')
const RPCClient = require('@hharnisc/micro-rpc-client')
const setSession = require('./setSession')
const listReposFixture = require('./fixtures/listRepos')
const listGithubRepos = require('./listGithubRepos')
const repoOwners = require('./repoOwners')
const repos = require('./repos')

const githubServiceClient = new RPCClient({
  url: 'http://github-service:3000/rpc',
})

const organizationServiceClient = new RPCClient({
  url: 'http://organization-service:3000/rpc',
})

const rpcHandler = setSession(
  rpc(
    method('listRepos', (): RepoList => listReposFixture),
    method('listGithubRepos', listGithubRepos({ githubServiceClient })),
    method('activateRepo', () => 'OK'),
    method('deactivateRepo', () => 'OK'),
    method('repoOwners', repoOwners({ organizationServiceClient })),
    method('repos', repos({ githubServiceClient })),
  ),
)

const healthHandler = () => ({
  status: 'OK',
})

module.exports = router(
  get('/api/healthz', healthHandler),
  post('/api/rpc', rpcHandler),
)
