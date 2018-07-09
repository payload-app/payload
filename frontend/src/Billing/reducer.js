import { actionTypes as dataFetchActionTypes } from '@hharnisc/async-data-fetch'
export const selector = 'Billing'

const initialState = {
  stripePublicKey: null,
  customers: [],
  repos: [],
  loadingActiveRepos: true,
}

const billingCustomerReducer = (state = {}, action) => {
  switch (action.type) {
    case `getBillingCustomer_${dataFetchActionTypes.FETCH_START}`:
      return {
        ...state,
        ownerId: action.args.ownerId,
        ownerType: action.args.ownerType,
        loading: true,
      }
    case `getBillingCustomers_${dataFetchActionTypes.FETCH_START}`:
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
    case `getBillingCustomers_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
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
          ...state.customers.filter(
            customer => !compareCustomerToAction({ customer, action }),
          ),
          billingCustomerReducer(customer, action),
        ],
      }
    case `getBillingCustomers_${dataFetchActionTypes.FETCH_START}`:
      return {
        ...state,
        customers: state.customers.map(customer =>
          billingCustomerReducer(customer, action),
        ),
      }
    case `getBillingCustomers_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
        customers: action.result.map(customer =>
          billingCustomerReducer(customer, action),
        ),
      }
    case `getRepos_${dataFetchActionTypes.FETCH_START}`:
      return {
        ...state,
        loadingActiveRepos: true,
      }
    case `getRepos_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
        loadingActiveRepos: false,
        repos: action.result,
      }
    default:
      return state
  }
}
