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

const updateRepoById = async ({ id, collectionClient }) => {
  const result = await collectionClient.updateOne(
    {
      _id: ObjectID(id),
    },
    {
      $set: { active: false },
    },
  )
  if (result.matchedCount !== 1) {
    throw new Error(`Could not update repo with id ${id}`)
  }
  return await collectionClient.findOne({ _id: ObjectID(id) })
}

const updateRepoByOwner = async ({ owner, repo, type, collectionClient }) => {
  const result = await collectionClient.updateOne(
    {
      owner,
      repo,
      type,
    },
    {
      $set: { active: false },
    },
  )
  if (result.matchedCount !== 1) {
    throw new Error(
      `Could not update user with owner ${owner} repo ${repo} type ${type}`,
    )
  }
  return await collectionClient.findOne({
    owner,
    repo,
    type,
  })
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
      return await updateRepoById({
        id,
        collectionClient,
      })
    }
    return await updateRepoByOwner({
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
