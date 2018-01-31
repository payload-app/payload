const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  orgId: Joi.number().required(), // the type specific orgId
  name: Joi.string().required(),
  type: Joi.string()
    .valid(['github'])
    .required(),
  userIds: Joi.array().unique(),
})

module.exports = ({ collectionClient, userServiceClient }) => async ({
  orgId,
  name,
  type,
  userIds,
}) => {
  try {
    await validate({
      value: {
        orgId,
        name,
        type,
        userIds,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  // TODO: when adding userIds - https://docs.mongodb.com/manual/reference/operator/update/addToSet/
  try {
    const users = await userServiceClient.call('getUsers', {
      ids: userIds,
    })
    const missingUserIds = userIds.filter((userId, idx) => !users[idx])
    if (missingUserIds.length) {
      throw new Error(
        `Could not find user(s) with ids: ${JSON.stringify(missingUserIds)}`,
      )
    }
    const { insertedId } = await collectionClient.insertOne({
      orgId,
      name,
      type,
      userIds,
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
