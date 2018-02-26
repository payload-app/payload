const uuidv4 = require('uuid/v4')
const { stateKey } = require('./utils')

module.exports = ({ redisClient }) => async () => {
  const state = uuidv4()
  await redisClient.setex(
    stateKey({ state }),
    process.env.STATE_TTL_SECONDS,
    state,
  )
  return { state }
}
