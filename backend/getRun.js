const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  id: Joi.string().required(),
})

module.exports = ({ runServiceClient }) => async ({ id }) => {
  try {
    await validate({
      value: {
        id,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  return await runServiceClient.call('getRun', { id })
}
