const { getUserFromSession } = require('./utils')

module.exports = async ({
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
