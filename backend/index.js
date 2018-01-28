// @flow
import type { RepoList } from 'api-types'
const { rpc, method } = require('@hharnisc/micro-rpc')
const { router, get, post } = require('microrouter')
const { githubApiCall } = require('./api/github')
const listReposFixture = require('./fixtures/listRepos')
const setSession = require('./setSession')

const parseTokenFromSession = ({ session }) => {
  if (session) {
    return session.user.accounts.github.accessToken
  }
}

const rpcHandler = setSession(
  rpc(
    method('listRepos', (): RepoList => listReposFixture),
    method('listGithubRepos', (_, { session }) => {
      return githubApiCall({
        endpoint: 'user/repos',
        token: parseTokenFromSession({ session }),
      })
    }),
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
