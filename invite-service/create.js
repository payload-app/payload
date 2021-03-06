const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

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
  console.log('email', email)
  try {
    const { insertedId } = await collectionClient.insertOne({
      email,
      createdAt: new Date(),
    })
    return {
      id: insertedId,
    }
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
