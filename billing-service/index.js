const { promisify } = require('util')
const { router, get, post } = require('microrouter')
const { MongoClient } = require('mongodb')
const { rpc, method } = require('@hharnisc/micro-rpc')
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
  return handler({ collectionClient })
}

const rpcHandler = ({ collectionClient }) =>
  rpc(method('startTrial', startTrial({ collectionClient })))

const healthHandler = () => 'OK'

module.exports = init(({ collectionClient }) =>
  router(
    get('/healthz', healthHandler),
    post('/rpc', rpcHandler({ collectionClient })),
  ),
)
