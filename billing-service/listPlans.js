// TODO: implement paging, assumes a small number of plans
module.exports = ({ stripeClient }) => async () => {
  const { data: plans } = await stripeClient.plans.list()
  return plans.map(plan => ({
    planType: plan.nickname,
    planId: plan.id,
    amount: plan.amount,
    currency: plan.currency,
  }))
}
