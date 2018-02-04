const { ObjectID } = require('mongodb')
const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object()
  .keys({
    id: Joi.string(),
    owner: Joi.string(),
    repo: Joi.string(),
    sha: Joi.string(),
    type: Joi.string().valid(['github']),
  })
  .xor('id', 'sha')
  .with('sha', ['owner', 'repo', 'type'])

const getRunById = async ({ id, collectionClient }) => {
  const run = await collectionClient.findOne({
    _id: ObjectID(id),
  })
  if (!run) {
    throw new Error(`Could not find run with id ${id}`)
  }
  return run
}

const getRunBySha = async ({ owner, repo, type, sha, collectionClient }) => {
  const run = await collectionClient.findOne({
    owner,
    repo,
    type,
    sha,
  })
  if (!run) {
    throw new Error(
      `Could not find run with owner ${owner} repo ${repo} type ${type} sha ${sha}`,
    )
  }
  return run
}

module.exports = ({ collectionClient }) => async ({
  id,
  owner,
  repo,
  sha,
  type = 'github',
}) => {
  try {
    await validate({
      value: {
        id,
        owner,
        repo,
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
    if (id) {
      return await getRunById({
        id,
        collectionClient,
      })
    }
    return await getRunBySha({
      owner,
      repo,
      type,
      sha,
      collectionClient,
    })
  } catch (error) {
    throw createError({
      message: `${error.message}`,
    })
  }
}
