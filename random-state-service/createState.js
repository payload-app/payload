const uuidv4 = require('uuid/v4')
const { stateKey } = require('./utils')

module.exports = ({ redisClient }) => async ({ metadata }) => {
  const state = uuidv4()
  await redisClient.setex(
    stateKey({ state }),
    process.env.STATE_TTL_SECONDS,
    JSON.stringify({
      state,
      metadata: metadata || {},
    }),
  )
  return { state, metadata: metadata || {} }
}
