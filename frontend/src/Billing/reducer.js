import { actionTypes as dataFetchActionTypes } from '@hharnisc/async-data-fetch'
export const selector = 'Billing'

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case `getStripePublicKey_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
        stripePublicKey: action.result,
      }
    case `getBillingCustomer_${dataFetchActionTypes.FETCH_START}`:
      return {
        ...state,
        loading: true,
      }
    case `getBillingCustomer_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
        ...action.result,
        loading: false,
      }
    default:
      return state
  }
}
