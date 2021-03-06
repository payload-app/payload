const { MongoClient } = require('mongodb')
const { rpc, method } = require('@hharnisc/micro-rpc')
const RPCClient = require('@hharnisc/micro-rpc-client')
const { router, get, post } = require('microrouter')
const createOrganization = require('./createOrganization')
const getOrganization = require('./getOrganization')
const getOrganizations = require('./getOrganizations')
const addUsers = require('./addUsers')

const init = async handler => {
  const client = await MongoClient.connect(
    `${process.env.MONGODB_URI}/${process.env.MONGODB_DATABASE}`,
    {
      useNewUrlParser: true,
    },
  )
  const collectionClient = client
    .db(process.env.MONGODB_DATABASE)
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
    method('getOrganizations', getOrganizations({ collectionClient })),
    method('addUsers', addUsers({ collectionClient, userServiceClient })),
  )

const healthHandler = () => 'OK'

module.exports = init(({ collectionClient, userServiceClient }) =>
  router(
    get('/healthz', healthHandler),
    post('/rpc', rpcHandler({ collectionClient, userServiceClient })),
  ),
)
