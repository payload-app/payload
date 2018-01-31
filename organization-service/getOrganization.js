const { ObjectID } = require('mongodb')
const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object()
  .keys({
    id: Joi.string(),
    orgId: Joi.number(),
    type: Joi.string(),
  })
  .xor('id', 'orgId')
  .and('orgId', 'type')

const getOrganizationById = async ({ id, collectionClient }) => {
  const organization = await collectionClient.findOne({
    _id: ObjectID(id),
  })
  if (!organization) {
    throw new Error(`Could not find organization with id ${id}`)
  }
  return organization
}

const getOrganizationByTypeOrgId = async ({
  orgId,
  type,
  collectionClient,
}) => {
  const organization = await collectionClient.findOne({
    orgId,
    type,
  })
  if (!organization) {
    throw new Error(
      `Could not find organization with orgId ${orgId} and type ${type}`,
    )
  }
  return organization
}

module.exports = ({ collectionClient }) => async ({ id, orgId, type }) => {
  try {
    await validate({
      value: {
        id,
        orgId,
        type,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  try {
    if (id) {
      return await getOrganizationById({ id, collectionClient })
    }
    return await getOrganizationByTypeOrgId({ orgId, type, collectionClient })
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
