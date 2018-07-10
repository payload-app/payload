const { createError } = require('@hharnisc/micro-rpc')

module.exports = ({ billingServiceClient }) => async ({ owners }) => {
  try {
    return await billingServiceClient.call('getCustomers', { owners })
  } catch (error) {
    throw createError({
      message: error.message,
    })
  }
}
