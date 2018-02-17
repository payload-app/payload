const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  repos: Joi.array().items(
    Joi.object().keys({
      repo: Joi.string().required(),
      active: Joi.boolean().required(),
    }),
  ),
  owner: Joi.string().required(),
  userId: Joi.string().required(),
  ownerType: Joi.string()
    .valid(['organization', 'user'])
    .required(),
  type: Joi.string()
    .valid(['github'])
    .required(),
})

module.exports = ({
  collectionClient,
  organizationServiceClient,
  userServiceClient,
}) => async ({ repos, owner, userId, ownerType, type }) => {
  try {
    await validate({
      value: {
        repos,
        userId,
        ownerType,
        owner,
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
    const repoArray = repos.map(repo => ({
      ...repo,
      owner,
      ownerType,
      userId,
      type,
    }))
    try {
      let result = await new Promise((resolve, reject) =>
        collectionClient.insertMany(
          repoArray,
          { ordered: false },
          (error, result) => {
            if (error) reject(error)
            resolve(result)
          },
        ),
      )
      return result.ops.map(inserted => ({ _id: inserted._id }))
    } catch (error) {
      if (error.result) {
        return error.result
          .getInsertedIds()
          .map(inserted => ({ _id: inserted._id }))
      }
      throw error
    }
  } catch (error) {
    throw createError({
      message: `${error.message}`,
    })
  }
}
