const { parseGithubTokenFromSession } = require('./utils')

module.exports = ({
  userServiceClient,
  organizationServiceClient,
  githubServiceClient,
  billingServiceClient,
}) => async (_, { session }) => {
  const accessToken = parseGithubTokenFromSession({ session })
  const userId = session.user._id
  const pages = await githubServiceClient.call('allPagesGithubRequest', {
    path: '/user/orgs',
    accessToken,
    pageSize: 100,
  })
  pages.forEach(page => {
    if (page.status !== 200) {
      throw new Error('there was an error fetching user orgs')
    }
  })
  const pageOrgArgs = pages.reduce((pageArgs, page) => {
    const onePageArgs = page.data.map(data => ({
      name: data.login,
      type: 'github',
      userIds: [userId],
    }))
    return [...pageArgs, ...onePageArgs]
  }, [])
  const organizationIds = []
  const organizations = []
  for (let orgArgs of pageOrgArgs) {
    let organizationId
    try {
      const { _id } = await organizationServiceClient.call('addUsers', orgArgs)
      organizationId = _id
    } catch (err) {
      if (
        err.message !==
        `Could not update organization with name ${orgArgs.name} and type ${
          orgArgs.type
        }`
      ) {
        throw err
      }
    }
    if (!organizationId) {
      const { id } = await organizationServiceClient.call(
        'createOrganization',
        orgArgs,
      )
      organizationId = id
    }
    organizationIds.push(organizationId)
    organizations.push(orgArgs)
  }
  await userServiceClient.call('addOrganizations', {
    id: userId,
    organizationIds,
  })
  // attempt to start a trial for all organizations sync'd
  for (let organizationId of organizationIds) {
    try {
      await billingServiceClient.call('startTrial', {
        ownerId: organizationId,
        ownerType: 'organization',
        userId,
      })
    } catch (error) {
      // if not a duplicate key error -- rethrow the error
      if (!error.message.includes('E11000')) {
        throw error
      }
    }
  }
  return {
    organizations,
  }
}
