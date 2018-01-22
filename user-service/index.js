const { Pool } = require('pg')
const { send } = require('micro')
const { rpc, method } = require('@hharnisc/micro-rpc')
const { router, get, post } = require('microrouter')
const createUser = require('./createUser')

const initDB = async handler => {
  const pgPool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
  })
  return handler({ pgPool })
}

const rpcHandler = ({ pgPool }) =>
  rpc(method('createUser', createUser({ pgPool })))

// TODO: write decortator to get a Client
// TODO: handle server closing by draining the connection pool -- pgPool.end

const healthHandler = ({ pgPool }) => async (req, res) => {
  try {
    const pgClient = await pgPool.connect()
    await pgClient.query('SELECT NOW()')
    send(res, 200, { status: 'OK' })
    pgClient.release(true)
  } catch (err) {
    send(res, 500, {
      status: 'cannot reach postgres',
    })
  }
}

module.exports = initDB(({ pgPool }) =>
  router(
    get('/healthz', healthHandler({ pgPool })),
    post('/rpc', rpcHandler({ pgPool })),
  ),
)
