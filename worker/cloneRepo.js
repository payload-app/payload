const { join } = require('path')
const git = require('simple-git/promise')
const { exec } = require('child-process-promise')
const { throwDisplayableError } = require('./utils')

module.exports = async ({
  accessToken,
  owner,
  repo,
  sha,
  logger,
  workingDirBase,
  username,
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
  logger.info({ message: 'changing repo permission to "sandbox" user' })
  await exec(`chown ${username} ${join(workingDirBase, sha)}`)
  logger.info({
    message: 'completed changing repo permission to "sandbox" user',
  })
}
