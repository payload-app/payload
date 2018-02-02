const { rpc, method } = require('@hharnisc/micro-rpc')
const { router, get, post } = require('microrouter')
const githubRequest = require('./githubRequest')
const allPagesGithubRequest = require('./allPagesGithubRequest')

const githubApiUrl = 'https://api.github.com'

const rpcHandler = rpc(
  method(
    'githubRequest',
    githubRequest({
      githubApiUrl,
    }),
  ),
  method(
    'allPagesGithubRequest',
    allPagesGithubRequest({
      githubApiUrl,
    }),
  ),
)

const healthHandler = () => ({ status: 'OK' })

module.exports = router(
  get('/healthz', healthHandler),
  post('/rpc', rpcHandler),
)
