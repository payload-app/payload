const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

// TODO: validate email address
const schema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required(),
})

module.exports = ({ collectionClient }) => async ({ email }) => {
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
    const { insertedId } = await collectionClient.insertOne({
      email,
      created: new Date(),
    })
    return {
      id: insertedId,
    }
  } catch (err) {
    throw createError({
      message: error.message,
    })
  }
}
