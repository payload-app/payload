import { actionTypes as dataFetchActionTypes } from '@hharnisc/async-data-fetch'
export const selector = 'Billing'

export const actionTypes = {
  TOGGLE_PAYMENT_OVERLAY: `${selector}/TOGGLE_PAYMENT_OVERLAY`,
  SELECT_BILLING_CUSTOMER: `${selector}/SELECT_BILLING_CUSTOMER`,
}

const initialState = {
  stripePublicKey: null,
  customers: [],
  repos: [],
  loadingActiveRepos: true,
}

const customerComparitor = (a, b) => {
  if (a.subscriptions.length > b.subscriptions.length) {
    return -1
  } else if (a.subscriptions.length < b.subscriptions.length) {
    return 1
  }
  return 0
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
        ].sort(customerComparitor),
      }
    case `getBillingCustomers_${dataFetchActionTypes.FETCH_START}`:
      return {
        ...state,
        customers: state.customers
          .map(customer => billingCustomerReducer(customer, action))
          .sort(customerComparitor),
      }
    case `getBillingCustomers_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
        customers: action.result
          .map(customer => billingCustomerReducer(customer, action))
          .sort(customerComparitor),
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
    case actionTypes.TOGGLE_PAYMENT_OVERLAY:
      return {
        ...state,
        showPaymentOverlay: action.visible,
      }
    case actionTypes.SELECT_BILLING_CUSTOMER:
      return {
        ...state,
        selectedBillingCustomer: action.id,
      }
    case `setPaymentSource_${dataFetchActionTypes.FETCH_START}`:
      return {
        ...state,
        showPaymentOverlay: false,
      }
    // TODO: display an error if setting the payment source failed on the backend
    default:
      return state
  }
}

export const actions = {
  togglePaymentOverlay: ({ visible }) => ({
    type: actionTypes.TOGGLE_PAYMENT_OVERLAY,
    visible,
  }),
  selectBillingCustomer: ({ id }) => ({
    type: actionTypes.SELECT_BILLING_CUSTOMER,
    id,
  }),
}
