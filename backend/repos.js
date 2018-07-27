const Joi = require('joi')
const { createError } = require('@hharnisc/micro-rpc')
const { validate, parseValidationErrorMessage } = require('./utils')
const validateUserAction = require('./validateUserAction')

const schema = Joi.object().keys({
  name: Joi.string().required(),
  ownerType: Joi.string().required(),
  type: Joi.string().required(),
})

const sep = '///'

const runKey = ({ run, repo }) => {
  if (run) {
    return [run.owner, run.repo, run.branch, run.type].join(sep)
  } else {
    return [repo.owner, repo.repo, repo.defaultBranch, repo.type].join(sep)
  }
}

module.exports = ({
  repoServiceClient,
  runServiceClient,
  organizationServiceClient,
}) => async ({ name, ownerType, type }, { session }) => {
  try {
    await validate({
      value: {
        name,
        ownerType,
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
    await validateUserAction({
      session,
      name,
      type,
      organizationServiceClient,
    })
    // get all repos for an owner
    const repos = await repoServiceClient.call('getOwnerRepos', {
      owner: name,
      ownerType,
      type,
    })

    // get last run for each active repo
    const runs = await runServiceClient.call('getLastRunPerRepoBranch', {
      repos: repos.filter(repo => repo.active).map(repo => ({
        owner: repo.owner,
        repo: repo.repo,
        branch: repo.defaultBranch,
        type: repo.type,
      })),
    })

    // convert array to hash to lookup in constant time
    const keyedRuns = runs.reduce((keyedRuns, run) => {
      if (run) {
        return Object.assign({}, keyedRuns, {
          [runKey({ run })]: run,
        })
      }
      return keyedRuns
    }, {})

    // merge the run into the repo object
    return repos.map(repo => {
      const run = keyedRuns[runKey({ repo })]
      if (run) {
        return Object.assign({}, repo, { lastDefaultRun: run })
      }
      return repo
    })
  } catch (error) {
    throw createError({ message: error.message })
  }
}
