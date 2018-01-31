const { ObjectID } = require('mongodb')
const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  ids: Joi.array()
    .unique()
    .required(),
})

module.exports = ({ collectionClient }) => async ({ ids }) => {
  try {
    await validate({
      value: {
        ids,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  try {
    const users = await collectionClient
      .find({
        _id: {
          $in: ids.map(id => ObjectID(id)),
        },
      })
      .toArray()
    const idUsers = users.reduce((userObject, user) => {
      const stringIdUser = {
        ...user,
        _id: user._id.toString(),
      }
      const userId = stringIdUser._id
      return {
        userObject,
        [userId]: stringIdUser,
      }
    }, {})
    return ids.map(id => {
      return idUsers[id]
    })
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
