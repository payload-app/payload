const { ObjectID } = require('mongodb')
const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  ids: Joi.array()
    .unique()
    .required(),
})

module.exports = ({ collectionClient }) => async ({ ids }) => {
  try {
    await validate({
      value: {
        ids,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  try {
    const organizations = await collectionClient
      .find({
        _id: {
          $in: ids.map(id => ObjectID(id)),
        },
      })
      .toArray()
    const idOrganizations = organizations.reduce(
      (organizationObject, organization) => {
        const stringIdOrganization = {
          ...organization,
          _id: organization._id.toString(),
        }
        const organizationId = stringIdOrganization._id
        return {
          organizationObject,
          [organizationId]: stringIdOrganization,
        }
      },
      {},
    )
    return ids.map(id => {
      return idOrganizations[id]
    })
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
