module.exports = ({ pgPool }) => async () => {
  const pgClient = await pgPool.connect()
  const res = await pgClient.query('SELECT $1::text as message', [
    'Hello world!',
  ])
  console.log('Message From Query:', res.rows[0].message)
  pgClient.release(true)
  return 'OK'
}
