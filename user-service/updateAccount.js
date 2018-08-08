const { ObjectID } = require('mongodb')
const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object()
  .keys({
    id: Joi.string(),
    email: Joi.string().email(),
    avatar: Joi.string().required(),
    username: Joi.string().required(),
    name: Joi.string().required(),
    accessToken: Joi.string().required(),
    type: Joi.string()
      .valid(['github'])
      .required(),
  })
  .xor('id', 'email')

const updateUserById = async ({
  id,
  accountType,
  accountData,
  collectionClient,
}) => {
  const result = await collectionClient.updateOne(
    {
      _id: ObjectID(id),
    },
    {
      $set: {
        [`accounts.${accountType}`]: accountData,
      },
    },
  )
  if (result.matchedCount !== 1) {
    throw new Error(`Could not update user with id ${id}`)
  }
  return await collectionClient.findOne({ _id: ObjectID(id) })
}

const updateUserByEmail = async ({
  email,
  accountType,
  accountData,
  collectionClient,
}) => {
  const result = await collectionClient.updateOne(
    {
      email,
    },
    {
      $set: {
        [`accounts.${accountType}`]: accountData,
      },
    },
  )
  if (result.matchedCount !== 1) {
    throw new Error(`Could not update user with email ${email}`)
  }
  return await collectionClient.findOne({ email })
}

module.exports = ({ collectionClient }) => async ({
  id,
  email,
  avatar,
  username,
  name,
  accessToken,
  type,
}) => {
  try {
    await validate({
      value: {
        id,
        email,
        avatar,
        username,
        name,
        accessToken,
        type,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  const accountData = {
    avatar,
    username,
    name,
    accessToken,
  }
  try {
    if (id) {
      return await updateUserById({
        id,
        accountType: type,
        accountData,
        collectionClient,
      })
    }
    return await updateUserByEmail({
      email,
      accountType: type,
      accountData,
      collectionClient,
    })
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
