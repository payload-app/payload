const Joi = require('joi')
const { createError } = require('@hharnisc/micro-rpc')
const { validate, parseValidationErrorMessage, pauseQueue } = require('./utils')

const schema = Joi.object().keys({
  queue: Joi.string().required(),
})

module.exports = ({ redisClient }) => async ({ queue }) => {
  try {
    await validate({
      value: {
        queue,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  const deleted = await redisClient.del(pauseQueue({ queue }))
  return { deleted }
}
