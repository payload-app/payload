const { ObjectID } = require('mongodb')
const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object()
  .keys({
    id: Joi.string(),
    orgId: Joi.number(),
    type: Joi.string(),
    userIds: Joi.array()
      .unique()
      .required(),
  })
  .xor('id', 'orgId')
  .and('orgId', 'type')

const updateOrganizationById = async ({ id, userIds, collectionClient }) => {
  const result = await collectionClient.updateOne(
    {
      _id: ObjectID(id),
    },
    {
      $addToSet: { userIds: { $each: userIds } },
    },
  )
  if (result.modifiedCount !== 1) {
    throw new Error(`Could not update organization with id ${id}`)
  }
  return await collectionClient.findOne({ _id: ObjectID(id) })
}

const getOrganizationByTypeOrgId = async ({
  orgId,
  type,
  userIds,
  collectionClient,
}) => {
  const result = await collectionClient.updateOne(
    {
      orgId,
      type,
    },
    {
      $addToSet: { userIds: { $each: userIds } },
    },
  )
  if (result.matchedCount !== 1) {
    throw new Error(
      `Could not update organization with orgId ${orgId} and type ${type}`,
    )
  }
  return await collectionClient.findOne({ orgId, type })
}

module.exports = ({ collectionClient, userServiceClient }) => async ({
  id,
  orgId,
  type,
  userIds,
}) => {
  try {
    await validate({
      value: {
        id,
        orgId,
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

    if (id) {
      return await updateOrganizationById({ id, userIds, collectionClient })
    }
    return await getOrganizationByTypeOrgId({
      orgId,
      type,
      userIds,
      collectionClient,
    })
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
