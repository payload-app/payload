const { json } = require('micro')
const { router, get, post } = require('microrouter')

const healthHandler = () => ({
  status: 'OK',
})

const webhookHandler = async (req, res) => {
  const payload = await json(req)
  console.log('*******')
  console.log('Event:', req.headers['x-github-event'])
  console.log(JSON.stringify(payload, null, 2))
  console.log('*******')
  return 'OK'
}

module.exports = router(
  get('/webhook/healthz', healthHandler),
  post('/webhook', webhookHandler),
)
