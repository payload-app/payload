// @flow
import type { RepoList, ListGithubRepoArgs } from 'api-types'
const { rpc, method } = require('@hharnisc/micro-rpc')
const { router, get, post } = require('microrouter')
const { githubApiCall } = require('./api/github')
const cors = require('micro-cors')
const listReposFixture = require('./fixtures/listRepos')

const rpcHandler = rpc(
  method('listRepos', (): RepoList => listReposFixture),
  method('listGithubRepos', ({ token }: ListGithubRepoArgs) =>
    githubApiCall({ endpoint: 'user/repos', token }),
  ),
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
