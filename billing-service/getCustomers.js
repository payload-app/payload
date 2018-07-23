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
  try {
    const cleanedOwners = owners.map(owner => ({
      ownerId: owner.ownerId,
      ownerType: owner.ownerType,
    }))
    const billingObjects = await collectionClient
      .find({
        $or: cleanedOwners,
      })
      .toArray()
    if (billingObjects.length !== owners.length) {
      throw new Error(
        `Could not find all billing objects billing all billing objects for ${JSON.stringify(
          cleanedOwners,
        )}`,
      )
    }
    return billingObjects.map(billingObject => ({
      ...billingObject,
      // filter subscriptions of stripe subscription id
      subscriptions: billingObject.subscriptions.map(sub => ({
        repoId: sub.repoId,
        planId: sub.planId,
        amount: sub.amount,
        currency: sub.currency,
      })),
    }))
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
