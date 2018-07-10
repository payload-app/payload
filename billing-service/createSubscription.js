const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')
const listPlans = require('./listPlans')

const schema = Joi.object().keys({
  ownerId: Joi.string().required(),
  ownerType: Joi.string()
    .required()
    .valid(['user', 'organization']),
  repoId: Joi.string().required(),
  planType: Joi.string().required(),
})

module.exports = ({
  collectionClient,
  stripeClient,
  repoServiceClient,
}) => async ({ ownerId, ownerType, repoId, planType }) => {
  try {
    await validate({
      value: {
        ownerId,
        ownerType,
        repoId,
        planType,
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

    const plans = await listPlans({ stripeClient })()
    const plan = plans.find(plan => plan.planType === planType)
    if (!plan) {
      throw new Error(`Could not find plan with type ${planType}`)
    }

    // ensure a valid repo
    await repoServiceClient.call('getRepo', {
      id: repoId,
    })

    if (billingObject.subscriptions.find(sub => sub.repoId === repoId)) {
      throw new Error(
        `A subscription has already been set for repo with id ${repoId}`,
      )
    }

    const planSubscriptions = billingObject.subscriptions.filter(
      sub => sub.planId === plan.planId,
    )

    // no subscriptions have been set yet with this plan
    let subscriptionId
    if (!planSubscriptions.length) {
      const subscription = await stripeClient.subscriptions.create({
        customer: billingObject.customerId,
        plan: plan.planId,
        quantity: 1,
        trial_end: Math.round(billingObject.trialEnd.getTime() / 1000),
      })
      subscriptionId = subscription.id
    } else {
      subscriptionId = planSubscriptions[0].subscriptionId
      await stripeClient.subscriptions.update(subscriptionId, {
        quantity: planSubscriptions.length + 1,
      })
    }

    const updateData = {
      $push: {
        subscriptions: {
          repoId,
          subscriptionId,
          planId: plan.planId,
          amount: plan.amount,
          currency: plan.currency,
        },
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
