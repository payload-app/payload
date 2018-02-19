const { ObjectID } = require('mongodb')
const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object()
  .keys({
    id: Joi.string().required(),
    fileSizes: Joi.array()
      .items(
        Joi.object().keys({
          file: Joi.string().required(),
          size: Joi.number().required(),
        }),
      )
      .min(1),
    errorMessage: Joi.string(),
  })
  .xor('fileSizes', 'errorMessage')

module.exports = ({ collectionClient }) => async ({
  id,
  fileSizes,
  errorMessage,
}) => {
  try {
    await validate({
      value: {
        id,
        fileSizes,
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
      $set: {
        stop: new Date(),
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
    } else {
      updateData = {
        ...updateData,
        $set: {
          ...updateData['$set'],
          fileSizes,
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
