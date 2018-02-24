const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  repos: Joi.array()
    .items(
      Joi.object().keys({
        owner: Joi.string().required(),
        repo: Joi.string().required(),
        branch: Joi.string().required(),
        type: Joi.string()
          .valid(['github'])
          .required(),
      }),
    )
    .required(),
})

module.exports = ({ collectionClient }) => async ({ repos }) => {
  try {
    await validate({
      value: {
        repos,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  try {
    // get the last run for each repo/branch specified
    return await Promise.all(
      repos.map(repo =>
        collectionClient.findOne({
          owner: repo.owner,
          repo: repo.repo,
          type: repo.type,
          branch: repo.branch,
        }),
      ),
    )
  } catch (error) {
    throw createError({
      message: `${error.message}`,
    })
  }
}
