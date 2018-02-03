const { promisify } = require('util')
const { MongoClient } = require('mongodb')
const { send } = require('micro')
const { rpc, method } = require('@hharnisc/micro-rpc')
const RPCClient = require('@hharnisc/micro-rpc-client')
const { router, get, post } = require('microrouter')
const createRepo = require('./createRepo')
const activateRepo = require('./activateRepo')
const deactivateRepo = require('./deactivateRepo')

const promisifiedMongoClient = promisify(MongoClient)

const initDB = async handler => {
  const client = await promisifiedMongoClient.connect(process.env.MONGO_URL)
  const collectionClient = client
    .db(process.env.MONGO_DB)
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
    method('activateRepo', activateRepo({ collectionClient })),
    method('deactivateRepo', deactivateRepo({ collectionClient })),
  )

const healthHandler = ({
  collectionClient,
  organizationServiceClient,
  userServiceClient,
}) => async (req, res) => {
  try {
    const dbResponse = await collectionClient.stats()
    if (!dbResponse.ok) {
      throw new Error('MongoDB is not ok')
    }
    await organizationServiceClient.call('methods')
    await userServiceClient.call('methods')
    send(res, 200, { status: 'OK' })
  } catch (err) {
    send(res, 500, {
      status: err.message,
    })
  }
}

module.exports = initDB(
  ({ collectionClient, organizationServiceClient, userServiceClient }) =>
    router(
      get(
        '/healthz',
        healthHandler({
          collectionClient,
          organizationServiceClient,
          userServiceClient,
        }),
      ),
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
