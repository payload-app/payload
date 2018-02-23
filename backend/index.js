require('dotenv').config()
const { rpc, method } = require('@hharnisc/micro-rpc')
const { router, get, post } = require('microrouter')
const RPCClient = require('@hharnisc/micro-rpc-client')
const setSession = require('./setSession')
const repoOwners = require('./repoOwners')
const repos = require('./repos')
const activateRepo = require('./activateRepo')
const getRun = require('./getRun')

const githubServiceClient = new RPCClient({
  url: 'http://github-service:3000/rpc',
})

const organizationServiceClient = new RPCClient({
  url: 'http://organization-service:3000/rpc',
})

const repoServiceClient = new RPCClient({
  url: 'http://repo-service:3000/rpc',
})

const runServiceClient = new RPCClient({
  url: 'http://run-service:3000/rpc',
})

const webhookBaseUrl = process.env.WEBHOOK_BASE_URL

const rpcHandler = setSession(
  rpc(
    method(
      'activateRepo',
      activateRepo({ repoServiceClient, githubServiceClient, webhookBaseUrl }),
    ),
    method('deactivateRepo', () => 'OK'),
    method('repoOwners', repoOwners({ organizationServiceClient })),
    method('repos', repos({ repoServiceClient, runServiceClient })),
    method('getRun', getRun({ runServiceClient })),
  ),
)

const healthHandler = () => ({
  status: 'OK',
})

module.exports = router(
  get('/api/healthz', healthHandler),
  post('/api/rpc', rpcHandler),
)
