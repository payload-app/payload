const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  ownerId: Joi.string().required(),
  ownerType: Joi.string()
    .required()
    .valid(['user', 'organization']),
  paymentSource: Joi.string().required(),
  lastFour: Joi.string().required(),
})

module.exports = ({ collectionClient, stripeClient }) => async ({
  ownerId,
  ownerType,
  paymentSource,
  lastFour,
}) => {
  try {
    await validate({
      value: {
        ownerId,
        ownerType,
        paymentSource,
        lastFour,
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
    if (!billingObject.customerId) {
      throw new Error(
        `A customer has not be been created for ${ownerType} with id ${ownerId}`,
      )
    }

    await stripeClient.customers.createSource(billingObject.customerId, {
      source: paymentSource,
    })

    const updateData = {
      $set: {
        paymentSourceSet: true,
        lastFour,
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
