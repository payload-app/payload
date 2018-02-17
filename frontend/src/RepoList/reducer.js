import { actionTypes as dataFetchActionTypes } from '@hharnisc/async-data-fetch'

export const selector = 'RepoList'

const initialState = {
  repos: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case `repos_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
        repos: action.result,
      }
    default:
      return state
  }
}
