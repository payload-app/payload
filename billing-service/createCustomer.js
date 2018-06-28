const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  ownerId: Joi.string().required(),
  ownerType: Joi.string()
    .required()
    .valid(['user', 'organization']),
})

module.exports = ({
  collectionClient,
  stripeClient,
  userServiceClient,
  organizationServiceClient,
}) => async ({ ownerId, ownerType }) => {
  try {
    await validate({
      value: {
        ownerId,
        ownerType,
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
    if (billingObject.customerId) {
      throw new Error(
        `A customer has already been created with id ${
          billingObject.customerId
        }`,
      )
    }

    let stripeDescription
    // if customer is org use the organization name for the description
    if (ownerType === 'organization') {
      const organization = await organizationServiceClient.call(
        'getOrganization',
        {
          id: ownerId,
        },
      )
      stripeDescription = organization.name
      // otherwise describe it as personal account
    } else {
      stripeDescription = 'personal'
    }

    const user = await userServiceClient.call('getUser', {
      id: billingObject.userId,
    })
    const customer = await stripeClient.customers.create({
      email: user.email,
      description: stripeDescription,
    })
    await collectionClient.updateOne(
      {
        ownerId,
        ownerType,
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
