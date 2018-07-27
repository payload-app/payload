const { createError } = require('@hharnisc/micro-rpc')
const {
  validateUserAction,
  validateOrganizationAction,
} = require('./validateAction')

module.exports = ({ repoServiceClient, organizationServiceClient }) => async (
  { ids },
  { session },
) => {
  try {
    const repos = await repoServiceClient.call('getRepos', { ids })
    for (let repo of repos) {
      if (repo.ownerType === 'user') {
        await validateUserAction({
          session,
          name: repo.owner,
          type: repo.type,
        })
      } else {
        validateOrganizationAction({
          session,
          name: repo.owner,
          type: repo.type,
          organizationServiceClient,
        })
      }
    }
    return repos
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
