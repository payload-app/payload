import { actionTypes as dataFetchActionTypes } from '@hharnisc/async-data-fetch'

export const selector = 'RepoList'

const initialState = {
  repos: [],
  showPaymentOverlay: false,
}

export const actionTypes = {
  TOGGLE_PAYMENT_OVERLAY: `${selector}/TOGGLE_PAYMENT_OVERLAY`,
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
}
