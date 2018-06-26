const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  organizationId: Joi.string().required(),
})

module.exports = ({
  collectionClient,
  stripeClient,
  userServiceClient,
  organizationServiceClient,
}) => async ({ organizationId }) => {
  try {
    await validate({
      value: {
        organizationId,
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
    if (billingObject.customerId) {
      throw new Error(
        `A customer has already been created with id ${
          billingObject.customerId
        }`,
      )
    }
    const organization = await organizationServiceClient.call(
      'getOrganization',
      {
        id: organizationId,
      },
    )
    const user = await userServiceClient.call('getUser', {
      id: billingObject.userId,
    })
    const customer = await stripeClient.customers.create({
      email: user.email,
      description: organization.name,
    })
    await collectionClient.updateOne(
      {
        organizationId,
      },
      {
        $set: {
          customerId: customer.id,
        },
      },
    )
    return 'OK'
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
