import { actionTypes as dataFetchActionTypes } from '@hharnisc/async-data-fetch'

export const selector = 'RepoList'

const initialState = {
  repos: [],
  showPaymentOverlay: false,
  showActivateConfirm: false,
  activateConfirmDetails: {},
}

export const actionTypes = {
  TOGGLE_PAYMENT_OVERLAY: `${selector}/TOGGLE_PAYMENT_OVERLAY`,
  TOGGLE_ACTIVATE_CONFIRM: `${selector}/TOGGLE_ACTIVATE_CONFIRM`,
}

const repoReducer = (state, action) => {
  switch (action.type) {
    case `activateRepo_${dataFetchActionTypes.FETCH_START}`:
      return {
        ...state,
        activating: true,
      }
    case `activateRepo_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
        active: true,
        activating: false,
      }
    case `activateRepo_${dataFetchActionTypes.FETCH_FAIL}`:
      return {
        ...state,
        activating: false,
      }
    default:
      return state
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case `repos_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
        repos: action.result,
      }
    case `activateRepo_${dataFetchActionTypes.FETCH_START}`:
    case `activateRepo_${dataFetchActionTypes.FETCH_FAIL}`:
    case `activateRepo_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
        repos: state.repos.map(repo => {
          if (
            repo.owner === action.args.owner &&
            repo.repo === action.args.repo &&
            repo.type === action.args.type
          ) {
            return repoReducer(repo, action)
          }
          return repo
        }),
      }
    case actionTypes.TOGGLE_PAYMENT_OVERLAY:
      return {
        ...state,
        showPaymentOverlay: action.visible,
      }
    case actionTypes.TOGGLE_ACTIVATE_CONFIRM:
      return {
        ...state,
        showActivateConfirm: action.visible,
        activateConfirmDetails: action.visible
          ? {
              repoName: action.repoName,
              repoOwnerName: action.repoOwnerName,
              repoType: action.repoType,
              currency: action.currency,
              amount: action.amount,
            }
          : {},
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
  toggleActivateConfirm: ({
    visible,
    repoName,
    repoOwnerName,
    repoType,
    currency,
    amount,
  }) => ({
    type: actionTypes.TOGGLE_ACTIVATE_CONFIRM,
    visible,
    repoName,
    repoOwnerName,
    repoType,
    currency,
    amount,
  }),
}
