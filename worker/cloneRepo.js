const { join } = require('path')
const git = require('simple-git/promise')
const { throwDisplayableError } = require('./utils')

module.exports = async ({
  accessToken,
  owner,
  repo,
  sha,
  logger,
  workingDirBase = '/tmp',
}) => {
  logger.info(`Cloning Repo ${owner}/${repo}`)
  try {
    await git(workingDirBase).clone(
      `https://${accessToken}@github.com/${owner}/${repo}.git`,
      sha,
    )
  } catch (err) {
    throwDisplayableError({
      message: err.message,
    })
  }
  logger.info(`Completed Cloning Repo`)
  logger.info(`Checking Out Sha: ${sha}`)
  try {
    await git(join(workingDirBase, sha)).checkout(sha)
  } catch (err) {
    throwDisplayableError({
      message: err.message,
    })
  }
  logger.info(`Completed Checking Out Sha: ${sha}`)
}
