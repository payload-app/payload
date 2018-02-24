const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  owner: Joi.string().required(),
  repo: Joi.string().required(),
  branch: Joi.string().required(),
  type: Joi.string()
    .valid(['github'])
    .required(),
})

module.exports = ({ collectionClient }) => async ({
  owner,
  repo,
  type,
  branch,
}) => {
  try {
    await validate({
      value: {
        owner,
        repo,
        type,
        branch,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  try {
    return await collectionClient
      .find({
        owner,
        repo,
        type,
        branch,
      })
      .toArray()
  } catch (error) {
    throw createError({
      message: `${error.message}`,
    })
  }
}
