const { promisify } = require('util')
const { router, get, post } = require('microrouter')
const { MongoClient } = require('mongodb')
const { rpc, method } = require('@hharnisc/micro-rpc')
const RPCClient = require('@hharnisc/micro-rpc-client')
const startTrial = require('./startTrial')

const promisifiedMongoClient = promisify(MongoClient)

const init = async handler => {
  const client = await promisifiedMongoClient.connect(
    `${process.env.MONGODB_URL}/${process.env.MONGODB_DATABASE}`,
    {
      auth: {
        user: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD,
      },
    },
  )
  const collectionClient = client
    .db(process.env.MONGODB_DATABASE)
    .collection('billing')
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
      'startTrial',
      startTrial({
        collectionClient,
        organizationServiceClient,
        userServiceClient,
      }),
    ),
  )

const healthHandler = () => 'OK'

module.exports = init(
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
