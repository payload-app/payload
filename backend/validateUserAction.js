const {
  getUserFromSession,
  parseGithubUsernameFromSession,
} = require('./utils')

module.exports = async ({
  session,
  name,
  type,
  ownerType,
  id,
  organizationServiceClient,
}) => {
  const user = getUserFromSession({ session })
  if (ownerType === 'user') {
    if (type === 'github') {
      const githubUsername = parseGithubUsernameFromSession({ session })
      if (githubUsername !== name) {
        throw new Error('User is not logged in user')
      }
    } else {
      throw new Error(
        'Need to implement other types for validating user actions',
      )
    }
  } else {
    let organizationId = id
    if (!id) {
      const result = await organizationServiceClient.call('getOrganization', {
        name,
        type,
      })
      organizationId = result._id
    }
    if (!organizationId || !user.organizationIds.includes(organizationId)) {
      throw new Error('User is not part of organization')
    }
  }
}
