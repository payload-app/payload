module.exports = ({ billingServiceClient }) => async ({ owners }) =>
  billingServiceClient.call('getCustomers', { owners })
