const { ObjectID } = require('mongodb')
const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object()
  .keys({
    id: Joi.string(),
    owner: Joi.string(),
    repo: Joi.string(),
    type: Joi.string().valid(['github']),
  })
  .xor('id', 'owner')
  .with('owner', ['repo', 'type'])

const getRepoById = async ({ id, collectionClient }) => {
  const repository = await collectionClient.findOne({
    _id: ObjectID(id),
  })
  if (!repository) {
    throw new Error(`Could not find repository with id ${id}`)
  }
  return repository
}

const getRepoByOwner = async ({ owner, repo, type, collectionClient }) => {
  const repository = await collectionClient.findOne({
    owner,
    repo,
    type,
  })
  if (!repository) {
    throw new Error(
      `Could not find repo with owner ${owner} repository ${repo} type ${type}`,
    )
  }
  return repository
}

module.exports = ({ collectionClient }) => async ({
  id,
  owner,
  repo,
  type = 'github',
}) => {
  try {
    await validate({
      value: {
        id,
        owner,
        repo,
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
      return await getRepoById({
        id,
        collectionClient,
      })
    }
    return await getRepoByOwner({
      owner,
      repo,
      type,
      collectionClient,
    })
  } catch (error) {
    throw createError({
      message: `${error.message}`,
    })
  }
}
