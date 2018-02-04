const { ObjectID } = require('mongodb')
const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  id: Joi.string().required(),
  errorMessage: Joi.string(),
})

module.exports = ({ collectionClient }) => async ({ id, errorMessage }) => {
  try {
    await validate({
      value: {
        id,
        errorMessage,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  try {
    let updateData = {
      $currentDate: {
        stop: { $type: 'timestamp' },
      },
    }
    if (errorMessage) {
      updateData = {
        ...updateData,
        $set: {
          ...updateData['$set'],
          errorMessage,
        },
      }
    }
    const result = await collectionClient.updateOne(
      {
        _id: ObjectID(id),
      },
      updateData,
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
