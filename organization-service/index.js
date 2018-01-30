const { promisify } = require('util')
const { MongoClient } = require('mongodb')
const { send } = require('micro')
const { rpc, method } = require('@hharnisc/micro-rpc')
const { router, get, post } = require('microrouter')
const createOrganization = require('./createOrganization')

const promisifiedMongoClient = promisify(MongoClient)

const initDB = async handler => {
  const client = await promisifiedMongoClient.connect(process.env.MONGO_URL)
  const collectionClient = client
    .db(process.env.MONGO_DB)
    .collection('organizations')
  const userCollectionClient = client
    .db(process.env.MONGO_DB)
    .collection('users')
  return handler({ collectionClient, userCollectionClient })
}

const rpcHandler = ({ collectionClient, userCollectionClient }) =>
  rpc(
    method(
      'createOrganization',
      createOrganization({ collectionClient, userCollectionClient }),
    ),
  )

const healthHandler = ({ collectionClient, userCollectionClient }) => async (
  req,
  res,
) => {
  try {
    const dbResponse = await collectionClient.stats()
    if (!dbResponse.ok) {
      throw new Error('MongoDB organizations collection is not ok')
    }
    const userDBResponse = await userCollectionClient.stats()
    if (!userDBResponse.ok) {
      throw new Error('MongoDB users collection is not ok')
    }
    send(res, 200, { status: 'OK' })
  } catch (err) {
    send(res, 500, {
      status: err.message,
    })
  }
}

module.exports = initDB(({ collectionClient, userCollectionClient }) =>
  router(
    get('/healthz', healthHandler({ collectionClient, userCollectionClient })),
    post('/rpc', rpcHandler({ collectionClient, userCollectionClient })),
  ),
)
