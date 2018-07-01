module.exports = ({ billingServiceClient }) => async () =>
  billingServiceClient.call('getStripePublicKey')
