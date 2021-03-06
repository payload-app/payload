const { MongoClient } = require('mongodb')
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

const initDB = async handler => {
  const client = await MongoClient.connect(
    `${process.env.MONGODB_URI}/${process.env.MONGODB_DATABASE}`,
    {
      useNewUrlParser: true,
    },
  )
  const collectionClient = client
    .db(process.env.MONGODB_DATABASE)
    .collection('runs')
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

const healthHandler = () => 'OK'

module.exports = initDB(({ collectionClient, repoServiceClient }) =>
  router(
    get('/healthz', healthHandler),
    post(
      '/rpc',
      rpcHandler({
        collectionClient,
        repoServiceClient,
      }),
    ),
  ),
)
