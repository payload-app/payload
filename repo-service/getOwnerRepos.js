const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  owner: Joi.string().required(),
  ownerType: Joi.string()
    .valid(['organization', 'user'])
    .required(),
  type: Joi.string()
    .valid(['github'])
    .required(),
})

module.exports = ({ collectionClient }) => async ({
  owner,
  ownerType,
  type,
}) => {
  try {
    await validate({
      value: {
        owner,
        ownerType,
        type,
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
        owner,
        ownerType,
        type,
      })
      .sort({
        active: -1,
      })
      .toArray()
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
