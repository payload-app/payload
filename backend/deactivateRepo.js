const { createError } = require('@hharnisc/micro-rpc')
const validateUserAction = require('./validateUserAction')
const {
  cleanupExistingWebooks,
  parseGithubTokenFromSession,
} = require('./utils')

module.exports = ({
  billingServiceClient,
  repoServiceClient,
  githubServiceClient,
  organizationServiceClient,
  webhookBaseUrl,
}) => async ({ ownerId, ownerType, repoId }, { session }) => {
  try {
    const accessToken = parseGithubTokenFromSession({ session })
    const { owner, repo, type } = await repoServiceClient.call('getRepo', {
      id: repoId,
    })
    await validateUserAction({
      session,
      name: owner,
      type,
      organizationServiceClient,
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
