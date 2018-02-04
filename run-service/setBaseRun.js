const { ObjectID } = require('mongodb')
const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  id: Joi.string().required(),
  baseRunId: Joi.string().required(),
})

module.exports = ({ collectionClient }) => async ({ id, baseRunId }) => {
  try {
    await validate({
      value: {
        id,
        baseRunId,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  try {
    if (baseRunId === id) {
      throw new Error(`baseRunId cannot match id`)
    }
    const run = await collectionClient.findOne({
      _id: ObjectID(baseRunId),
    })
    if (!run) {
      throw new Error(`Could not find run with baseRunId ${baseRunId}`)
    }
    const result = await collectionClient.updateOne(
      {
        _id: ObjectID(id),
      },
      {
        $set: {
          baseRunId,
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
