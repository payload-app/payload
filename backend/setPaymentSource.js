module.exports = ({ billingServiceClient }) => async ({
  ownerId,
  ownerType,
  paymentSource,
}) =>
  billingServiceClient.call('setPaymentSource', {
    ownerId,
    ownerType,
    paymentSource,
  })
