const Joi = require('joi')
const { createError } = require('@hharnisc/micro-rpc')
const { validate, parseValidationErrorMessage } = require('./utils')

const schema = Joi.object().keys({
  token: Joi.string().required(),
})

module.exports = async ({ token }) => {
  try {
    await validate({
      value: {
        token,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }

  // just a no-op until session data is persisted
  return { status: 'OK' }
}
