const Joi = require('joi')
const { createError } = require('@hharnisc/micro-rpc')
const { validate, parseValidationErrorMessage } = require('./utils')

const schema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required(),
})

module.exports = ({ collectionClient, userServiceClient }) => async ({
  email,
}) => {
  try {
    await validate({
      value: {
        email,
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
      email,
    })
    if (!result) {
      throw new Error(`Could not find user with email: ${email}`)
    }
    if (!result.userId) {
      return null
    }
    return result.userId
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
