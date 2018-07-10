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

module.exports = ({ collectionClient, stripeClient }) => async ({
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
    const subscription = billingObject.subscriptions.find(
      sub => sub.repoId === repoId,
    )
    if (!subscription) {
      throw new Error(
        `Could not find a subscription for the repo with id ${repoId}`,
      )
    }
    // cancel the subscription
    if (billingObject.subscriptions.length < 2) {
      await stripeClient.subscriptions.del(subscription.subscriptionId)
      // just decrement the quantity
    } else {
      await stripeClient.subscriptions.update(subscription.subscriptionId, {
        quantity: billingObject.subscriptions.length - 1,
      })
    }

    const updateData = {
      $pull: {
        subscriptions: subscription,
      },
    }
    await collectionClient.updateOne(
      {
        ownerId,
        ownerType,
      },
      updateData,
    )
    return 'OK'
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
