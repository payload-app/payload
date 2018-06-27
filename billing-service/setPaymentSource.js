const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  organizationId: Joi.string().required(),
  paymentSource: Joi.string().required(),
})

module.exports = ({ collectionClient, stripeClient }) => async ({
  organizationId,
  paymentSource,
}) => {
  try {
    await validate({
      value: {
        organizationId,
        paymentSource,
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
    if (!billingObject.customerId) {
      throw new Error(
        `A customer has not be been created for organization with id ${organizationId}`,
      )
    }

    await stripeClient.customers.createSource(billingObject.customerId, {
      source: paymentSource,
    })

    const updateData = {
      $set: {
        paymentSourceSet: true,
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
