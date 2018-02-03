const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  owner: Joi.string().required(),
  repo: Joi.string().required(),
  active: Joi.boolean().required(),
  ownerType: Joi.string()
    .valid(['organization', 'user'])
    .required(),
  type: Joi.string()
    .valid(['github'])
    .required(),
  userId: Joi.string().required(),
})

module.exports = ({
  collectionClient,
  organizationServiceClient,
  userServiceClient,
}) => async ({
  owner,
  repo,
  ownerType,
  userId,
  active = false,
  type = 'github',
}) => {
  try {
    await validate({
      value: {
        owner,
        repo,
        active,
        ownerType,
        type,
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
    if (ownerType === 'organization') {
      await organizationServiceClient.call('getOrganization', {
        name: owner,
        type,
      })
    } else {
      await userServiceClient.call('getUser', {
        id: userId,
      })
    }
    const { insertedId } = await collectionClient.insertOne({
      owner,
      repo,
      active,
      ownerType,
      type,
      userId,
    })
    return {
      id: insertedId,
    }
  } catch (error) {
    throw createError({
      message: `${error.message}`,
    })
  }
}
