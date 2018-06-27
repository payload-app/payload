const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  organizationId: Joi.string().required(),
})

module.exports = ({ collectionClient }) => async ({ organizationId }) => {
  try {
    await validate({
      value: {
        organizationId,
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
      organizationId,
    })
    if (!billingObject) {
      throw new Error(
        `Could not find billing object for organization with id ${organizationId}`,
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
