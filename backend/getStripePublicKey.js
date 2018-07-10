const { createError } = require('@hharnisc/micro-rpc')

module.exports = ({ billingServiceClient }) => async () => {
  try {
    return await billingServiceClient.call('getStripePublicKey')
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
