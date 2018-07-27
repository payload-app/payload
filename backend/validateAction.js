const {
  getUserFromSession,
  parseGithubUsernameFromSession,
} = require('./utils')

const validateUserAction = async ({ session, id, name, type }) => {
  const user = getUserFromSession({ session })
  if (id) {
    if (id !== user._id) {
      throw new Error('User is not logged in user')
    }
  } else if (type === 'github') {
    const githubUsername = parseGithubUsernameFromSession({ session })
    if (githubUsername !== name) {
      throw new Error('User is not logged in user')
    }
  } else {
    throw new Error('Need to implement other types for validating user actions')
  }
}

const validateOrganizationAction = async ({
  session,
  name,
  type,
  id,
  organizationServiceClient,
}) => {
  const user = getUserFromSession({ session })
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

module.exports = {
  validateUserAction,
  validateOrganizationAction,
}
