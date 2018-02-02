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
      orgId: data.id,
      name: data.login,
      type: 'github',
      userIds: [userId],
    }))
    return [...pageArgs, ...onePageArgs]
  }, [])
  const organizationIds = []
  for (let orgArgs of pageOrgArgs) {
    let organizationId
    try {
      const updateArgs = {
        ...orgArgs,
        name: undefined,
      }
      const { _id } = await organizationServiceClient.call(
        'addUsers',
        updateArgs,
      )
      organizationId = _id
    } catch (err) {
      if (
        err.message !==
        `Could not update organization with orgId ${orgArgs.orgId} and type ${
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
  }
  await userServiceClient.call('addOrganizations', {
    id: userId,
    organizationIds,
  })
  return organizationIds
}
