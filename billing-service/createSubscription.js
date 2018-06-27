const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')
const listPlans = require('./listPlans')

const schema = Joi.object().keys({
  organizationId: Joi.string().required(),
  repoId: Joi.string().required(),
  planType: Joi.string().required(),
})

module.exports = ({
  collectionClient,
  stripeClient,
  repoServiceClient,
}) => async ({ organizationId, repoId, planType }) => {
  try {
    await validate({
      value: {
        organizationId,
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
      organizationId,
    })
    if (!billingObject) {
      throw new Error(
        `Could not find billing object for organization with id ${organizationId}`,
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
        trial_end: billingObject.trialEnd.getTime() / 1000,
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
