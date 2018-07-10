const { createError } = require('@hharnisc/micro-rpc')

module.exports = ({ billingServiceClient, repoServiceClient }) => async ({
  ownerId,
  ownerType,
  repoId,
}) => {
  try {
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
