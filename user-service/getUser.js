const { ObjectID } = require('mongodb')
const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object()
  .keys({
    id: Joi.string(),
    email: Joi.string(),
  })
  .xor('id', 'email')

const getUserById = async ({ id, collectionClient }) => {
  const user = await collectionClient.findOne({
    _id: ObjectID(id),
  })
  if (!user) {
    throw new Error(`Could not find user with id ${id}`)
  }
  return user
}

const getUserByEmail = async ({ email, collectionClient }) => {
  const user = await collectionClient.findOne({
    email,
  })
  if (!user) {
    throw new Error(`Could not find user with email ${email}`)
  }
  return user
}

module.exports = ({ collectionClient }) => async ({ id, email }) => {
  try {
    await validate({
      value: {
        id,
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
    if (id) {
      return await getUserById({ id, collectionClient })
    }
    return await getUserByEmail({ email, collectionClient })
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
