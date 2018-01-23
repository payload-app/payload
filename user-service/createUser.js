const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  avatar: Joi.string().required(),
  username: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  accessToken: Joi.string().required(),
  email: Joi.string().required(),
  type: Joi.string().required(),
})

module.exports = ({ collectionClient }) => async ({
  avatar,
  username,
  firstName,
  lastName,
  accessToken,
  email,
  type = 'github',
}) => {
  const user = {
    avatar,
    username,
    firstName,
    lastName,
    accessToken,
    email,
    type,
  }
  try {
    const validation = await validate({
      value: user,
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  try {
    const { insertedId } = await collectionClient.insertOne(user)
    return {
      id: insertedId,
    }
  } catch (error) {
    throw createError({
      message: `${error.message}`,
    })
  }
}
