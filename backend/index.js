require('dotenv').config()
const { rpc, method } = require('@hharnisc/micro-rpc')
const { router, get, post } = require('microrouter')
const RPCClient = require('@hharnisc/micro-rpc-client')
const setSession = require('./setSession')
const repoOwners = require('./repoOwners')
const repos = require('./repos')
const activateRepo = require('./activateRepo')
const getRun = require('./getRun')
const syncOrganizations = require('./syncOrganizations')
const syncRepos = require('./syncRepos')
const logout = require('./logout')
const getUser = require('./getUser')
const getBillingCustomer = require('./getBillingCustomer')
const getStripePublicKey = require('./getStripePublicKey')
const setPaymentSource = require('./setPaymentSource')
const getBillingCustomers = require('./getBillingCustomers')
const getRepos = require('./getRepos')
const deactivateRepo = require('./deactivateRepo')
const inviteStatusHandler = require('./inviteStatusHandler')
const issueRandomState = require('./issueRandomState')
const createInvite = require('./createInvite')

const cookieDomain = process.env.COOKIE_DOMAIN

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

const userServiceClient = new RPCClient({
  url: 'http://user-service:3000/rpc',
})

const sessionServiceClient = new RPCClient({
  url: 'http://session-service:3000/rpc',
})

const billingServiceClient = new RPCClient({
  url: 'http://billing-service:3000/rpc',
})

const inviteServiceClient = new RPCClient({
  url: 'http://invite-service:3000/rpc',
})

const randomStateServiceClient = new RPCClient({
  url: 'http://random-state-service:3000/rpc',
})

const webhookBaseUrl = process.env.WEBHOOK_BASE_URL

if (webhookBaseUrl === undefined) {
  console.log('Make sure you have a `WEBHOOK_BASE_URL` set in `backend/.env`')
}

const rpcHandler = setSession(
  rpc(
    method(
      'activateRepo',
      activateRepo({
        repoServiceClient,
        githubServiceClient,
        organizationServiceClient,
        billingServiceClient,
        webhookBaseUrl,
      }),
    ),
    method('repoOwners', repoOwners({ organizationServiceClient })),
    method(
      'repos',
      repos({ repoServiceClient, runServiceClient, organizationServiceClient }),
    ),
    method(
      'getRun',
      getRun({
        runServiceClient,
        repoServiceClient,
        organizationServiceClient,
      }),
    ),
    method(
      'syncOrganizations',
      syncOrganizations({
        userServiceClient,
        organizationServiceClient,
        githubServiceClient,
        billingServiceClient,
      }),
    ),
    method(
      'syncRepos',
      syncRepos({
        githubServiceClient,
        repoServiceClient,
        organizationServiceClient,
      }),
    ),
    method(
      'getBillingCustomer',
      getBillingCustomer({
        billingServiceClient,
      }),
    ),
    method(
      'getStripePublicKey',
      getStripePublicKey({
        billingServiceClient,
      }),
    ),
    method(
      'setPaymentSource',
      setPaymentSource({
        billingServiceClient,
      }),
    ),
    method(
      'getBillingCustomers',
      getBillingCustomers({
        billingServiceClient,
      }),
    ),
    method(
      'getRepos',
      getRepos({ repoServiceClient, organizationServiceClient }),
    ),
    method(
      'deactivateRepo',
      deactivateRepo({
        billingServiceClient,
        repoServiceClient,
        githubServiceClient,
        organizationServiceClient,
        webhookBaseUrl,
      }),
    ),
    method('logout', logout({ sessionServiceClient, cookieDomain })),
    method('getUser', getUser),
  ),
)

const healthHandler = () => 'OK'

module.exports = router(
  get('/', healthHandler),
  get('/healthz', healthHandler),
  post('/api/rpc', rpcHandler),
  post('/api/invite/status', inviteStatusHandler({ inviteServiceClient })),
  post('/api/issueRandomState', issueRandomState({ randomStateServiceClient })),
  post(
    '/api/createInvite',
    createInvite({
      randomStateServiceClient,
      inviteServiceClient,
      cookieDomain,
    }),
  ),
)
