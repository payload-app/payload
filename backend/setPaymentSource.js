const { createError } = require('@hharnisc/micro-rpc')

module.exports = ({ billingServiceClient }) => async ({
  ownerId,
  ownerType,
  paymentSource,
  lastFour,
}) => {
  try {
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
