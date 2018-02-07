const uuid = require('uuid/v4')
const { ObjectID } = require('mongodb')
const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object()
  .keys({
    id: Joi.string(),
    webhook: Joi.string()
      .valid(['payload'])
      .required(),
    owner: Joi.string(),
    repo: Joi.string(),
    type: Joi.string().valid(['github']),
  })
  .xor('id', 'owner')
  .with('owner', ['repo', 'type'])

const updateRepoById = async ({
  webhook,
  webhookToken,
  id,
  collectionClient,
}) => {
  const result = await collectionClient.updateOne(
    {
      _id: ObjectID(id),
    },
    {
      $set: { [`webhooks.${webhook}`]: webhookToken },
    },
  )
  if (result.matchedCount !== 1) {
    throw new Error(`Could not update repo with id ${id}`)
  }
  return await collectionClient.findOne({ _id: ObjectID(id) })
}

const updateRepoByOwner = async ({
  webhook,
  webhookToken,
  owner,
  repo,
  type,
  collectionClient,
}) => {
  const result = await collectionClient.updateOne(
    {
      owner,
      repo,
      type,
    },
    {
      $set: { [`webhooks.${webhook}`]: webhookToken },
    },
  )
  if (result.matchedCount !== 1) {
    throw new Error(
      `Could not update repo with owner ${owner} repo ${repo} type ${type}`,
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
  webhook,
}) => {
  try {
    await validate({
      value: {
        id,
        owner,
        repo,
        type,
        webhook,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  try {
    const webhookToken = uuid()
    if (id) {
      return await updateRepoById({
        id,
        collectionClient,
        webhook,
        webhookToken,
      })
    }
    return await updateRepoByOwner({
      owner,
      repo,
      type,
      collectionClient,
      webhook,
      webhookToken,
    })
  } catch (error) {
    throw createError({
      message: `${error.message}`,
    })
  }
}
