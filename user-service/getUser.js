const { ObjectID } = require('mongodb')
const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  id: Joi.string().required(),
})

module.exports = ({ collectionClient }) => async ({ id }) => {
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
  try {
    const user = await collectionClient.findOne({
      _id: ObjectID(id),
    })
    if (!user) {
      throw new Error(`Could not find user with id ${id}`)
    }
    return user
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
