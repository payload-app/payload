const { createError } = require('@hharnisc/micro-rpc')

module.exports = ({ billingServiceClient }) => async ({
  ownerId,
  ownerType,
}) => {
  try {
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
