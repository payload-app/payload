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
  return handler({ collectionClient })
}

const rpcHandler = ({ collectionClient }) =>
  rpc(method('createOrganization', createOrganization({ collectionClient })))

const healthHandler = ({ collectionClient }) => async (req, res) => {
  try {
    const dbResponse = await collectionClient.stats()
    if (!dbResponse.ok) {
      throw new Error('MongoDB is not ok')
    }
    send(res, 200, { status: 'OK' })
  } catch (err) {
    send(res, 500, {
      status: err.message,
    })
  }
}

module.exports = initDB(({ collectionClient }) =>
  router(
    get('/healthz', healthHandler({ collectionClient })),
    post('/rpc', rpcHandler({ collectionClient })),
  ),
)