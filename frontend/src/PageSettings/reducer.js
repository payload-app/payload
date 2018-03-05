export const selector = 'Settings'
import { actionTypes as dataFetchActionTypes } from '@hharnisc/async-data-fetch'

const initialState = {
  sync: {
    organizations: {
      loading: false,
    },
    repositories: {
      loading: false,
    },
  },
}

const settingsPageTypeReducer = (state, action) => {
  switch (action.type) {
    case `syncOrganizations_${dataFetchActionTypes.FETCH_START}`:
    case `syncRepos_${dataFetchActionTypes.FETCH_START}`:
      return {
        ...state,
        loading: true,
      }
    case `syncOrganizations_${dataFetchActionTypes.FETCH_SUCCESS}`:
    case `syncRepos_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
        loading: false,
      }
    default:
      return state
  }
}

const settingsPageReducer = (state, action) => {
  switch (action.type) {
    case `syncOrganizations_${dataFetchActionTypes.FETCH_START}`:
    case `syncOrganizations_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
        organizations: settingsPageTypeReducer(state.organizations, action),
      }
    case `syncRepos_${dataFetchActionTypes.FETCH_SUCCESS}`:
    case `syncRepos_${dataFetchActionTypes.FETCH_START}`:
      return {
        ...state,
        repositories: settingsPageTypeReducer(state.repositories, action),
      }
    default:
      return state
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case `syncOrganizations_${dataFetchActionTypes.FETCH_SUCCESS}`:
    case `syncOrganizations_${dataFetchActionTypes.FETCH_START}`:
    case `syncRepos_${dataFetchActionTypes.FETCH_SUCCESS}`:
    case `syncRepos_${dataFetchActionTypes.FETCH_START}`:
      return {
        ...state,
        [action.args.page]: settingsPageReducer(
          state[action.args.page],
          action,
        ),
      }
    default:
      return state
  }
}
