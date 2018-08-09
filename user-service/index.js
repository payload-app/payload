const { MongoClient } = require('mongodb')
const { rpc, method } = require('@hharnisc/micro-rpc')
const RPCClient = require('@hharnisc/micro-rpc-client')
const { router, get, post } = require('microrouter')
const createUser = require('./createUser')
const getUser = require('./getUser')
const getUsers = require('./getUsers')
const updateAccount = require('./updateAccount')
const addOrganizations = require('./addOrganizations')

const initDB = async handler => {
  const client = await MongoClient.connect(
    `${process.env.MONGODB_URI}/${process.env.MONGODB_DATABASE}`,
    {
      useNewUrlParser: true,
    },
  )
  const collectionClient = client
    .db(process.env.MONGODB_DATABASE)
    .collection('users')
  const organizationServiceClient = new RPCClient({
    url: 'http://organization-service:3000/rpc',
  })
  return handler({ collectionClient, organizationServiceClient })
}

const rpcHandler = ({ collectionClient, organizationServiceClient }) =>
  rpc(
    method(
      'createUser',
      createUser({ collectionClient, organizationServiceClient }),
    ),
    method('getUser', getUser({ collectionClient, organizationServiceClient })),
    method(
      'getUsers',
      getUsers({ collectionClient, organizationServiceClient }),
    ),
    method(
      'updateAccount',
      updateAccount({ collectionClient, organizationServiceClient }),
    ),
    method(
      'addOrganizations',
      addOrganizations({ collectionClient, organizationServiceClient }),
    ),
  )

const healthHandler = () => 'OK'

module.exports = initDB(({ collectionClient, organizationServiceClient }) =>
  router(
    get('/healthz', healthHandler),
    post('/rpc', rpcHandler({ collectionClient, organizationServiceClient })),
  ),
)
