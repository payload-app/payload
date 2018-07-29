const Joi = require('joi')
const { createError } = require('@hharnisc/micro-rpc')
const { validate, parseValidationErrorMessage } = require('./utils')

const schema = Joi.object().keys({
  userId: Joi.string().required(),
})

module.exports = ({ collectionClient }) => async ({ userId }) => {
  try {
    await validate({
      value: {
        userId,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  try {
    const result = await collectionClient.findOne({
      userId,
    })
    return !!result
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
