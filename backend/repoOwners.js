module.exports = ({ organizationServiceClient }) => async (_, { session }) => {
  const organizationIds = session.user.organizationIds
  const organizations = await organizationServiceClient.call(
    'getOrganizations',
    {
      ids: organizationIds,
    },
  )
  const userAccounts = session.user.accounts
  return [
    ...Object.keys(userAccounts).map(accountKey => ({
      name: userAccounts[accountKey].username,
      type: accountKey,
      ownerType: 'user',
      id: session.user._id,
    })),
    ...organizations.map(org => ({
      name: org.name,
      type: org.type,
      ownerType: 'organization',
      id: org._id,
    })),
  ]
}
