const { ObjectID } = require('mongodb')
const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object()
  .keys({
    id: Joi.string(),
    email: Joi.string(),
    organizationIds: Joi.array()
      .unique()
      .required(),
  })
  .xor('id', 'email')

const updateUserById = async ({ id, organizationIds, collectionClient }) => {
  const result = await collectionClient.updateOne(
    {
      _id: ObjectID(id),
    },
    {
      $addToSet: { organizationIds: { $each: organizationIds } },
    },
  )
  if (result.matchedCount !== 1) {
    throw new Error(`Could not update user with id ${id}`)
  }
  return await collectionClient.findOne({ _id: ObjectID(id) })
}

const updateUserByEmail = async ({
  email,
  organizationIds,
  collectionClient,
}) => {
  const result = await collectionClient.updateOne(
    {
      email,
    },
    {
      $addToSet: { organizationIds: { $each: organizationIds } },
    },
  )
  if (result.matchedCount !== 1) {
    throw new Error(`Could not update user with email ${email}`)
  }
  return await collectionClient.findOne({ email })
}

module.exports = ({ collectionClient, organizationServiceClient }) => async ({
  id,
  email,
  organizationIds,
}) => {
  try {
    await validate({
      value: {
        id,
        email,
        organizationIds,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  try {
    const organizations = await organizationServiceClient.call(
      'getOrganizations',
      {
        ids: organizationIds,
      },
    )
    const missingOrganizationIds = organizationIds.filter(
      (userId, idx) => !organizations[idx],
    )
    if (missingOrganizationIds.length) {
      throw new Error(
        `Could not find organizations(s) with ids: ${JSON.stringify(
          missingOrganizationIds,
        )}`,
      )
    }
    if (id) {
      return await updateUserById({
        id,
        organizationIds,
        collectionClient,
      })
    }
    return await updateUserByEmail({
      email,
      organizationIds,
      collectionClient,
    })
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
