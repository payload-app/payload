module.exports = ({ pgClient }) => async () => {
  const res = await pgClient.query('SELECT $1::text as message', [
    'Hello world!',
  ])
  console.log('Message From Query:', res.rows[0].message)
  return 'OK'
}
