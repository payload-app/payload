import { actionTypes as dataFetchActionTypes } from '@hharnisc/async-data-fetch'

export const selector = 'RepoSelector'

export const actionTypes = {
  SET_VALUE: `${selector}/SET_VALUE`,
}

const initialState = {
  repoOwners: [],
  value: undefined,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_VALUE:
      return {
        ...state,
        value: action.value,
      }
    case `repoOwners_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
        repoOwners: action.result,
      }
    default:
      return state
  }
}

export const actions = {
  setValue: ({ value }) => ({
    type: actionTypes.SET_VALUE,
    value,
  }),
}
