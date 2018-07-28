const { promisify } = require('util')
const { MongoClient } = require('mongodb')
const { rpc, method } = require('@hharnisc/micro-rpc')
const RPCClient = require('@hharnisc/micro-rpc-client')
const { router, get, post } = require('microrouter')
const create = require('./create')
const send = require('./send')
const accept = require('./accept')
const getInvitedUserId = require('./getInvitedUserId')

const promisifiedMongoClient = promisify(MongoClient)

const initDB = async handler => {
  const client = await promisifiedMongoClient.connect(
    `${process.env.MONGODB_URL}/${process.env.MONGODB_DATABASE}`,
    {
      auth: {
        user: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD,
      },
      useNewUrlParser: true,
    },
  )
  const collectionClient = client
    .db(process.env.MONGODB_DATABASE)
    .collection('invites')
  const userServiceClient = new RPCClient({
    url: 'http://user-service:3000/rpc',
  })
  return handler({ collectionClient, userServiceClient })
}

const rpcHandler = ({ collectionClient, userServiceClient }) =>
  rpc(
    method('create', create({ collectionClient })),
    method('send', send({ collectionClient, userServiceClient })),
    method('accept', accept({ collectionClient, userServiceClient })),
    method('getInvitedUserId', getInvitedUserId({ collectionClient })),
  )

const healthHandler = () => 'OK'

module.exports = initDB(({ collectionClient, userServiceClient }) =>
  router(
    get('/healthz', healthHandler),
    post('/rpc', rpcHandler({ collectionClient, userServiceClient })),
  ),
)
