module.exports = async ({
  userServiceClient,
  organizationServiceClient,
  githubServiceClient,
  userId,
  accessToken,
}) => {
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
  return {
    organizationIds,
    organizations,
  }
}
