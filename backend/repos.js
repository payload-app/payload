const Joi = require('joi')
const { validate } = require('./utils')
const { createError } = require('@hharnisc/micro-rpc')

const schema = Joi.object().keys({
  name: Joi.string().required(),
  ownerType: Joi.string().required(),
})

const sep = '///'

const runKey = ({ run, repo }) => {
  if (run) {
    return [run.owner, run.repo, run.branch, run.type].join(sep)
  } else {
    return [repo.owner, repo.repo, repo.defaultBranch, repo.type].join(sep)
  }
}

module.exports = ({ repoServiceClient, runServiceClient }) => async ({
  name,
  ownerType,
}) => {
  try {
    await validate({
      value: {
        name,
        ownerType,
      },
      schema,
    })
  } catch (error) {
    throw createError({
      message: parseValidationErrorMessage({ error }),
    })
  }
  try {
    // get all repos for an owner
    const repos = await repoServiceClient.call('getOwnerRepos', {
      owner: name,
      ownerType,
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
  } catch (err) {
    console.log('err', err)
    throw createError({ message: err.message })
  }
}
