const { ObjectID } = require('mongodb')
const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object()
  .keys({
    id: Joi.string(),
    name: Joi.string(),
    type: Joi.string(),
  })
  .xor('id', 'name')
  .and('name', 'type')

const getOrganizationById = async ({ id, collectionClient }) => {
  const organization = await collectionClient.findOne({
    _id: ObjectID(id),
  })
  if (!organization) {
    throw new Error(`Could not find organization with id ${id}`)
  }
  return organization
}

const getOrganizationByTypeOrgName = async ({
  name,
  type,
  collectionClient,
}) => {
  const organization = await collectionClient.findOne({
    name,
    type,
  })
  if (!organization) {
    throw new Error(
      `Could not find organization with name ${name} and type ${type}`,
    )
  }
  return organization
}

module.exports = ({ collectionClient }) => async ({ id, name, type }) => {
  try {
    await validate({
      value: {
        id,
        name,
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
    return await getOrganizationByTypeOrgName({ name, type, collectionClient })
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
