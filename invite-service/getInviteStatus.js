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
  try {
    const result = await collectionClient.findOne({
      email,
    })
    const after = await collectionClient
      .find({ createdAt: { $gt: result.createdAt } })
      .count()
    const before = await collectionClient
      .find({ createdAt: { $lt: result.createdAt } })
      .count()
    return {
      before,
      after,
    }
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
