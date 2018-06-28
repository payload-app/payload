const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  ownerId: Joi.string().required(),
  ownerType: Joi.string()
    .required()
    .valid(['user', 'organization']),
})

module.exports = ({ collectionClient }) => async ({ ownerId, ownerType }) => {
  try {
    await validate({
      value: {
        ownerId,
        ownerType,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }

  try {
    const billingObject = await collectionClient.findOne({
      ownerId,
      ownerType,
    })
    if (!billingObject) {
      throw new Error(
        `Could not find billing object for ${ownerType} with id ${ownerId}`,
      )
    }
    return billingObject.subscriptions.map(sub => ({
      repoId: sub.repoId,
      planId: sub.planId,
      amount: sub.amount,
      currency: sub.currency,
    }))
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
