const { join } = require('path')
const git = require('simple-git/promise')

module.exports = async ({
  accessToken,
  owner,
  repo,
  sha,
  logger,
  workingDirBase = '/tmp',
}) => {
  logger.info(`Cloning Repo ${owner}/${repo}`)
  await git(workingDirBase).clone(
    `https://${accessToken}@github.com/${owner}/${repo}.git`,
    sha,
  )
  logger.info(`Completed Cloning Repo`)
  logger.info(`Checking Out Sha: ${sha}`)
  await git(join(workingDirBase, sha)).checkout(sha)
  logger.info(`Completed Checking Out Sha: ${sha}`)
}
