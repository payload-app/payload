import { actionTypes as dataFetchActionTypes } from '@hharnisc/async-data-fetch'
export const selector = 'Billing'

const initialState = {
  stripePublicKey: null,
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

const compareCustomerToAction = ({ customer, action }) =>
  customer.ownerId === action.args.ownerId &&
  customer.ownerType === action.args.ownerType

export default (state = initialState, action) => {
  switch (action.type) {
    case `getStripePublicKey_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
        stripePublicKey: action.result,
      }
    case `getBillingCustomer_${dataFetchActionTypes.FETCH_START}`:
    case `getBillingCustomer_${dataFetchActionTypes.FETCH_SUCCESS}`:
      const customer = state.customers.find(customer =>
        compareCustomerToAction({ customer, action }),
      )
      return {
        ...state,
        customers: [
          ...state.customers.filter(customer =>
            compareCustomerToAction({ customer, action }),
          ),
          billingCustomerReducer(customer, action),
        ],
      }
    default:
      return state
  }
}
