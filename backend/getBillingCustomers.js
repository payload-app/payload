const { createError } = require('@hharnisc/micro-rpc')
const {
  validateUserAction,
  validateOrganizationAction,
} = require('./validateAction')

module.exports = ({ billingServiceClient }) => async (
  { owners },
  { session },
) => {
  try {
    for (let { ownerType, ownerId } of owners) {
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
    }
    return await billingServiceClient.call('getCustomers', { owners })
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
