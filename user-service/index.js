const { Client } = require('pg')
const { send } = require('micro')
const { rpc, method } = require('@hharnisc/micro-rpc')
const { router, get, post } = require('microrouter')
const createUser = require('./createUser')

const initDB = async handler => {
  const pgClient = new Client({
    user: 'postgres', // TODO: these should be env vars
    host: 'postgres',
    database: 'payload',
  })
  await pgClient.connect() // TODO: use a pool instead
  return handler({ pgClient })
}

const rpcHandler = ({ pgClient }) =>
  rpc(method('createUser', createUser({ pgClient })))

const healthHandler = ({ pgClient }) => async (req, res) => {
  try {
    await pgClient.query('SELECT NOW()')
    send(res, 200, { status: 'OK' })
  } catch (err) {
    send(res, 500, {
      status: 'cannot reach postgres',
    })
  }
}

module.exports = initDB(({ pgClient }) =>
  router(
    get('/healthz', healthHandler({ pgClient })),
    post('/rpc', rpcHandler({ pgClient })),
  ),
)
