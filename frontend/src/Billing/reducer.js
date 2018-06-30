import { actionTypes as dataFetchActionTypes } from '@hharnisc/async-data-fetch'
export const selector = 'Billing'

const initialState = {
  customers: [],
}

const billingCustomerReducer = (state = {}, action) => {
  switch (action.type) {
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

export default (state = initialState, action) => {
  switch (action.type) {
    case `getBillingCustomer_${dataFetchActionTypes.FETCH_START}`:
    case `getBillingCustomer_${dataFetchActionTypes.FETCH_SUCCESS}`:
      const customerSelector = `${action.args.ownerType}///${
        action.args.ownerId
      }`
      return {
        ...state,
        customers: {
          ...state.customers,
          [customerSelector]: billingCustomerReducer(
            state[customerSelector],
            action,
          ),
        },
      }
    default:
      return state
  }
}
