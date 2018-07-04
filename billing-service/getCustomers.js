const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  owners: Joi.array()
    .items(
      Joi.object().keys({
        ownerId: Joi.string().required(),
        ownerType: Joi.string()
          .required()
          .valid(['user', 'organization']),
      }),
    )
    .min(1),
})

module.exports = ({ collectionClient }) => async ({ owners }) => {
  try {
    await validate({
      value: {
        owners,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  console.log('owners', owners)
  try {
    const billingObjects = await collectionClient.find({
      $or: owners.map(owner => ({
        ownerId: owner.ownerId,
        ownerType: owner.ownerType,
      })),
    })
    console.log(
      owners.map(owner => ({
        ownerId: owner.ownerId,
        ownerType: owner.ownerType,
      })),
    )
    console.log('billingObjects.toArray()', billingObjects.toArray())
    // if (!billingObject) {
    //   throw new Error(
    //     `Could not find billing object for ${ownerType} with id ${ownerId}`,
    //   )
    // }
    return 'OK'
    // return {
    //   ...billingObject,
    //   // filter stripe customerId
    //   customerId: undefined,
    //   // filter subscriptions of stripe subscription id
    //   subscriptions: billingObject.subscriptions.map(sub => ({
    //     repoId: sub.repoId,
    //     planId: sub.planId,
    //     amount: sub.amount,
    //     currency: sub.currency,
    //   })),
    // }
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
