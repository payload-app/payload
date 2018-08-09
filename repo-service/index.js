const { MongoClient } = require('mongodb')
const { rpc, method } = require('@hharnisc/micro-rpc')
const RPCClient = require('@hharnisc/micro-rpc-client')
const { router, get, post } = require('microrouter')
const createRepo = require('./createRepo')
const activateRepo = require('./activateRepo')
const deactivateRepo = require('./deactivateRepo')
const getRepo = require('./getRepo')
const getRepos = require('./getRepos')
const getOwnerRepos = require('./getOwnerRepos')
const createRepos = require('./createRepos')
const generateWebhookToken = require('./generateWebhookToken')

const initDB = async handler => {
  const client = await MongoClient.connect(
    `${process.env.MONGODB_URI}/${process.env.MONGODB_DATABASE}`,
    {
      useNewUrlParser: true,
    },
  )
  const collectionClient = client
    .db(process.env.MONGODB_DATABASE)
    .collection('repositories')
  const organizationServiceClient = new RPCClient({
    url: 'http://organization-service:3000/rpc',
  })
  const userServiceClient = new RPCClient({
    url: 'http://user-service:3000/rpc',
  })
  return handler({
    collectionClient,
    organizationServiceClient,
    userServiceClient,
  })
}

const rpcHandler = ({
  collectionClient,
  organizationServiceClient,
  userServiceClient,
}) =>
  rpc(
    method(
      'createRepo',
      createRepo({
        collectionClient,
        organizationServiceClient,
        userServiceClient,
      }),
    ),
    method(
      'createRepos',
      createRepos({
        organizationServiceClient,
        userServiceClient,
        collectionClient,
      }),
    ),
    method('activateRepo', activateRepo({ collectionClient })),
    method('deactivateRepo', deactivateRepo({ collectionClient })),
    method('getRepo', getRepo({ collectionClient })),
    method('getRepos', getRepos({ collectionClient })),
    method('getOwnerRepos', getOwnerRepos({ collectionClient })),
    method('generateWebhookToken', generateWebhookToken({ collectionClient })),
  )

const healthHandler = () => 'OK'

module.exports = initDB(
  ({ collectionClient, organizationServiceClient, userServiceClient }) =>
    router(
      get('/healthz', healthHandler),
      post(
        '/rpc',
        rpcHandler({
          collectionClient,
          organizationServiceClient,
          userServiceClient,
        }),
      ),
    ),
)
