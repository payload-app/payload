const { promisify } = require('util')
const { MongoClient } = require('mongodb')
const { send } = require('micro')
const { rpc, method } = require('@hharnisc/micro-rpc')
const RPCClient = require('@hharnisc/micro-rpc-client')
const { router, get, post } = require('microrouter')
const createOrganization = require('./createOrganization')
const getOrganization = require('./getOrganization')
const addUsers = require('./addUsers')

const promisifiedMongoClient = promisify(MongoClient)

const init = async handler => {
  const client = await promisifiedMongoClient.connect(process.env.MONGO_URL)
  const collectionClient = client
    .db(process.env.MONGO_DB)
    .collection('organizations')
  const userServiceClient = new RPCClient({
    url: 'http://user-service:3000/rpc',
  })
  return handler({ collectionClient, userServiceClient })
}

const rpcHandler = ({ collectionClient, userServiceClient }) =>
  rpc(
    method(
      'createOrganization',
      createOrganization({ collectionClient, userServiceClient }),
    ),
    method('getOrganization', getOrganization({ collectionClient })),
    method('addUsers', addUsers({ collectionClient, userServiceClient })),
  )

const healthHandler = ({ collectionClient, userServiceClient }) => async (
  req,
  res,
) => {
  try {
    const dbResponse = await collectionClient.stats()
    if (!dbResponse.ok) {
      throw new Error('MongoDB organizations collection is not ok')
    }
    await userServiceClient.call('methods')
    send(res, 200, { status: 'OK' })
  } catch (err) {
    send(res, 500, {
      status: err.message,
    })
  }
}

module.exports = init(({ collectionClient, userServiceClient }) =>
  router(
    get('/healthz', healthHandler({ collectionClient, userServiceClient })),
    post('/rpc', rpcHandler({ collectionClient, userServiceClient })),
  ),
)
