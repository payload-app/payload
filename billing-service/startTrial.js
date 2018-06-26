const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  organizationId: Joi.string().required(),
  userId: Joi.string().required(),
  trialEnd: Joi.date()
    .min('now')
    .required(),
})

module.exports = ({
  collectionClient,
  organizationServiceClient,
  userServiceClient,
}) => async ({ organizationId, userId, trialEnd }) => {
  try {
    await validate({
      value: {
        organizationId,
        trialEnd,
        userId,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  try {
    // ensure organization exists
    await organizationServiceClient.call('getOrganization', {
      id: organizationId,
    })
    // ensure user exists
    const user = await userServiceClient.call('getUser', {
      id: userId,
    })
    if (!user.organizationIds.includes(organizationId)) {
      throw new Error(
        `User with id ${userId} does not belong to organization with id ${organizationId}`,
      )
    }
    const { insertedId } = await collectionClient.insertOne({
      organizationId,
      userId,
      trialEnd: new Date(isNaN(trialEnd) ? trialEnd : parseInt(trialEnd, 10)),
      paymentSourceSet: false,
    })
    return {
      id: insertedId,
    }
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
