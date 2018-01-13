const rp = require('request-promise')
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
  method('broadcastStatus', ({
    accessToken,
    owner,
    repo,
    sha,
    state,
    description,
    targetUrl,
    context,
  }) => rp({
    method: 'POST',
    uri: `https://api.github.com/repos/${owner}/${repo}/statuses/${sha}?access_token=${accessToken}`,
    json: true,
    body: {
      state,
      description,
      target_url: targetUrl,
      context,
    }
  })),
)

const healthHandler = () => ({
  status: 'OK',
})

module.exports = router(
  get('/healthz', healthHandler),
  post('/rpc', rpcHandler),
)
