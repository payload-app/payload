const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const trialDays = parseInt(process.env.TRIAL_DAYS, 10)

const schema = Joi.object().keys({
  ownerId: Joi.string().required(),
  ownerType: Joi.string()
    .required()
    .valid(['user', 'organization']),
  userId: Joi.string().required(),
  trialEnd: Joi.date().min('now'),
})

module.exports = ({
  collectionClient,
  organizationServiceClient,
  userServiceClient,
}) => async ({ ownerId, ownerType, userId, trialEnd }) => {
  try {
    await validate({
      value: {
        ownerId,
        ownerType,
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
    if (ownerType === 'organization') {
      await organizationServiceClient.call('getOrganization', {
        id: ownerId,
      })
    } else if (ownerId !== userId) {
      throw new Error(
        `userId ${userId} must match ownerId ${ownerId} if ownerType=${ownerType}`,
      )
    }

    // ensure user exists
    const user = await userServiceClient.call('getUser', {
      id: userId,
    })
    if (
      ownerType === 'organization' &&
      !user.organizationIds.includes(ownerId)
    ) {
      throw new Error(
        `User with id ${userId} does not belong to organization with id ${ownerId}`,
      )
    }
    const now = new Date()
    // try to use the trial end provided, otherwise fallback to the default
    const dbTrialEnd = trialEnd
      ? new Date(isNaN(trialEnd) ? trialEnd : parseInt(trialEnd, 10))
      : new Date(now.setDate(now.getDate() + trialDays))
    const { insertedId } = await collectionClient.insertOne({
      ownerId,
      ownerType,
      userId,
      trialEnd: dbTrialEnd,
      paymentSourceSet: false,
      subscriptions: [],
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
