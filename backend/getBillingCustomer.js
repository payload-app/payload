const { createError } = require('@hharnisc/micro-rpc')
const {
  validateUserAction,
  validateOrganizationAction,
} = require('./validateAction')

module.exports = ({ billingServiceClient }) => async (
  { ownerId, ownerType },
  { session },
) => {
  try {
    if (ownerType === 'user') {
      await validateUserAction({
        id: ownerId,
        session,
      })
    } else {
      await validateOrganizationAction({
        id: ownerId,
        session,
      })
    }
    return await billingServiceClient.call('getCustomer', {
      ownerId,
      ownerType,
    })
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
