const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  ownerId: Joi.string().required(),
  ownerType: Joi.string()
    .required()
    .valid(['user', 'organization']),
  repoId: Joi.string().required(),
})

const trialActive = ({ trialEnd }) => trialEnd.getTime() > new Date().getTime()

module.exports = ({ collectionClient }) => async ({
  ownerId,
  ownerType,
  repoId,
}) => {
  try {
    await validate({
      value: {
        ownerId,
        ownerType,
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
      ownerId,
      ownerType,
    })
    if (!billingObject) {
      throw new Error(
        `Could not find billing object for ${ownerType} with id ${ownerId}`,
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
