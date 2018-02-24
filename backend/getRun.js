const Joi = require('joi')
const { validate, parseValidationErrorMessage } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  owner: Joi.string().required(),
  repo: Joi.string().required(),
  sha: Joi.string().required(),
  type: Joi.string()
    .valid(['github'])
    .required(),
})

module.exports = ({ runServiceClient, repoServiceClient }) => async ({
  owner,
  repo,
  sha,
  type,
}) => {
  try {
    await validate({
      value: {
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

  const run = await runServiceClient.call('getRun', { owner, repo, sha, type })
  const repository = await repoServiceClient.call('getRepo', { id: run.repoId })
  const recentDefaultBranchRuns = await runServiceClient.call(
    'getLatestBranchRuns',
    {
      owner,
      repo,
      type,
      branch: repository.defaultBranch,
    },
  )
  return Object.assign({}, run, {
    recentDefaultBranchRuns,
  })
}
