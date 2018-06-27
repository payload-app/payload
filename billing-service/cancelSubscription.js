const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  organizationId: Joi.string().required(),
  repoId: Joi.string().required(),
})

module.exports = ({ collectionClient, stripeClient }) => async ({
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
        organizationId,
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
