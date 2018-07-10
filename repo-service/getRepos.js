const { ObjectID } = require('mongodb')
const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  ids: Joi.array()
    .items(Joi.string().required())
    .min(1),
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
    return await collectionClient
      .find({
        _id: {
          $in: ids.map(id => ObjectID(id)),
        },
      })
      .toArray()
  } catch (error) {
    throw createError({
      message: `${error.message}`,
    })
  }
}
