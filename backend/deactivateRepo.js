const { createError } = require('@hharnisc/micro-rpc')
const {
  validateUserAction,
  validateOrganizationAction,
} = require('./validateAction')
const {
  cleanupExistingWebooks,
  parseGithubTokenFromSession,
} = require('./utils')

module.exports = ({
  billingServiceClient,
  repoServiceClient,
  githubServiceClient,
  organizationServiceClient,
  webhookUrl,
}) => async ({ ownerId, ownerType, repoId }, { session }) => {
  try {
    const accessToken = parseGithubTokenFromSession({ session })
    const { owner, repo, type } = await repoServiceClient.call('getRepo', {
      id: repoId,
    })
    if (ownerType === 'user') {
      await validateUserAction({
        session,
        type,
        name: owner,
      })
    } else {
      await validateOrganizationAction({
        session,
        name: owner,
        type,
        organizationServiceClient,
      })
    }

    await cleanupExistingWebooks({
      githubServiceClient,
      appName: 'payload',
      owner,
      repo,
      webhookUrl,
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
