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
    const result = await collectionClient.updateOne(
      {
        _id: ObjectID(id),
      },
      {
        $set: {
          start: new Date(),
        },
        $unset: {
          fileSizes: '',
          errorMessage: '',
          stop: '',
        },
      },
    )
    if (result.matchedCount !== 1) {
      throw new Error(`Could not update user with id ${id}`)
    }
    return await collectionClient.findOne({
      _id: ObjectID(id),
    })
  } catch (error) {
    throw createError({
      message: `${error.message}`,
    })
  }
}
