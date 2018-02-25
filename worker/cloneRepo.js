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
  logger.info({ message: 'cloning repo' })
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
  logger.info({ message: 'completed cloning repo' })
  logger.info({ message: 'checking out repo', data: { sha } })
  try {
    await git(join(workingDirBase, sha)).checkout(sha)
  } catch (err) {
    throwDisplayableError({
      message: err.message,
    })
  }
  logger.info({ message: 'completed checking out repo', data: { sha } })
}
