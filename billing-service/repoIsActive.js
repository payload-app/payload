const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  organizationId: Joi.string().required(),
  repoId: Joi.string().required(),
})

const trialActive = ({ trialEnd }) => trialEnd.getTime() > new Date().getTime()

module.exports = ({ collectionClient }) => async ({
  organizationId,
  repoId,
}) => {
  try {
    await validate({
      value: {
        organizationId,
        repoId,
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
    return (
      (trialActive(billingObject) || billingObject.paymentSourceSet) &&
      !!billingObject.subscriptions.find(sub => sub.repoId === repoId)
    )
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
