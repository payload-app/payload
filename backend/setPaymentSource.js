const { createError } = require('@hharnisc/micro-rpc')
const {
  validateUserAction,
  validateOrganizationAction,
} = require('./validateAction')

module.exports = ({ billingServiceClient }) => async (
  { ownerId, ownerType, paymentSource, lastFour },
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
    const billingCustomer = await billingServiceClient.call('getCustomer', {
      ownerId,
      ownerType,
    })
    // ensure a customer exists
    if (!billingCustomer.customerId) {
      await billingServiceClient.call('createCustomer', {
        ownerId,
        ownerType,
      })
    }
    return await billingServiceClient.call('setPaymentSource', {
      ownerId,
      ownerType,
      paymentSource,
      lastFour,
    })
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
