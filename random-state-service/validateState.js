const Joi = require('joi')
const { createError } = require('@hharnisc/micro-rpc')
const { validate, parseValidationErrorMessage, stateKey } = require('./utils')

const schema = Joi.object().keys({
  state: Joi.string().required(),
})

module.exports = ({ redisClient }) => async ({ state }) => {
  try {
    await validate({
      value: {
        state,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  const result = await redisClient.get(stateKey({ state }))
  if (!result) {
    return { valid: false }
  }
  const { metadata } = JSON.parse(result)
  return { valid: true, metadata }
}
