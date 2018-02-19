const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  owner: Joi.string().required(),
  repo: Joi.string().required(),
  repoId: Joi.string().required(),
  branch: Joi.string().required(),
  sha: Joi.string().required(),
  type: Joi.string()
    .valid(['github'])
    .required(),
})

module.exports = ({ collectionClient, repoServiceClient }) => async ({
  owner,
  repo,
  repoId,
  branch,
  sha,
  type = 'github',
}) => {
  try {
    await validate({
      value: {
        owner,
        repo,
        repoId,
        branch,
        sha,
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
    await repoServiceClient.call('getRepo', {
      id: repoId,
    })
    const { insertedId } = await collectionClient.insertOne({
      owner,
      repo,
      repoId,
      branch,
      sha,
      type,
      created: new Date(),
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
