const { promisify } = require('util')
const { MongoClient } = require('mongodb')
const { send } = require('micro')
const { rpc, method } = require('@hharnisc/micro-rpc')
const RPCClient = require('@hharnisc/micro-rpc-client')
const { router, get, post } = require('microrouter')
const createRun = require('./createRun')
const getRun = require('./getRun')
const startRun = require('./startRun')
const stopRun = require('./stopRun')
const setBaseRun = require('./setBaseRun')
const getLastRunPerRepoBranch = require('./getLastRunPerRepoBranch')
const getLatestBranchRuns = require('./getLatestBranchRuns')

const promisifiedMongoClient = promisify(MongoClient)

const initDB = async handler => {
  const client = await promisifiedMongoClient.connect(process.env.MONGO_URL)
  const collectionClient = client.db(process.env.MONGO_DB).collection('runs')
  const repoServiceClient = new RPCClient({
    url: 'http://repo-service:3000/rpc',
  })
  return handler({
    collectionClient,
    repoServiceClient,
  })
}

const rpcHandler = ({ collectionClient, repoServiceClient }) =>
  rpc(
    method(
      'createRun',
      createRun({
        collectionClient,
        repoServiceClient,
      }),
    ),
    method('getRun', getRun({ collectionClient })),
    method('startRun', startRun({ collectionClient })),
    method('stopRun', stopRun({ collectionClient })),
    method('setBaseRun', setBaseRun({ collectionClient })),
    method(
      'getLastRunPerRepoBranch',
      getLastRunPerRepoBranch({ collectionClient }),
    ),
    method('getLatestBranchRuns', getLatestBranchRuns({ collectionClient })),
  )

const healthHandler = ({ collectionClient, repoServiceClient }) => async (
  req,
  res,
) => {
  try {
    const dbResponse = await collectionClient.stats()
    if (!dbResponse.ok) {
      throw new Error('MongoDB is not ok')
    }
    await repoServiceClient.call('methods')
    send(res, 200, { status: 'OK' })
  } catch (err) {
    send(res, 500, {
      status: err.message,
    })
  }
}

module.exports = initDB(({ collectionClient, repoServiceClient }) =>
  router(
    get(
      '/healthz',
      healthHandler({
        collectionClient,
        repoServiceClient,
      }),
    ),
    post(
      '/rpc',
      rpcHandler({
        collectionClient,
        repoServiceClient,
      }),
    ),
  ),
)
