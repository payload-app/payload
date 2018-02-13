import { actionTypes as dataFetchActionTypes } from '@hharnisc/async-data-fetch'

export const selector = 'RepoSelector'

export const actionTypes = {
  ON_CHANGE: `${selector}/ON_CHANGE`,
}

const initialState = {
  repoOwners: [],
  value: undefined,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ON_CHANGE:
      return {
        ...state,
        value: action.value,
      }
    case `repoOwners_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
        value:
          action.result && action.result.length > 0
            ? action.result[0]
            : undefined,
        repoOwners: action.result,
      }
    default:
      return state
  }
}

export const actions = {
  onChange: ({ value }) => ({
    type: actionTypes.ON_CHANGE,
    value,
  }),
}
