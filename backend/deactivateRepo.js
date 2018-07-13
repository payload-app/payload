const { createError } = require('@hharnisc/micro-rpc')
const {
  cleanupExistingWebooks,
  parseGithubTokenFromSession,
} = require('./utils')

module.exports = ({
  billingServiceClient,
  repoServiceClient,
  githubServiceClient,
  webhookBaseUrl,
}) => async ({ ownerId, ownerType, repoId }, { session }) => {
  try {
    const accessToken = parseGithubTokenFromSession({ session })
    const { owner, repo } = await repoServiceClient.call('getRepo', {
      id: repoId,
    })
    await cleanupExistingWebooks({
      githubServiceClient,
      appName: 'payload',
      owner,
      repo,
      webhookBaseUrl,
      accessToken,
    })
    await repoServiceClient.call('deactivateRepo', {
      id: repoId,
    })
    await billingServiceClient.call('cancelSubscription', {
      ownerId,
      ownerType,
      repoId,
    })
    return 'OK'
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
