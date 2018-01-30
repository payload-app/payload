const { ObjectID } = require('mongodb')
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

const userIdDifference = ({ userIds, dbUserIds }) => {
  const dbUserIdsSet = new Set(dbUserIds)
  return userIds.filter(userId => !dbUserIdsSet.has(userId))
}

module.exports = ({ collectionClient, userCollectionClient }) => async ({
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
    const dbUsers = await userCollectionClient
      .find({
        _id: {
          $in: userIds.map(userId => ObjectID(userId)),
        },
      })
      .toArray()
    const dbUserIds = dbUsers.map(dbUser => dbUser._id.toString())
    const missingUserIds = userIdDifference({ userIds, dbUserIds })
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
