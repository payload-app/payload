require('dotenv').config()
const SmeeClient = require('smee-client')

const smee = new SmeeClient({
  source: `https://smee.io/${process.env.SMEE_KEY}`,
  target: 'http://webhook-collector:3000/webhook/payload',
  logger: console,
})
smee.start()
