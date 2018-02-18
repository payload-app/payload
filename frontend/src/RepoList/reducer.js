import { actionTypes as dataFetchActionTypes } from '@hharnisc/async-data-fetch'

export const selector = 'RepoList'

const initialState = {
  repos: [],
}

const repoReducer = (state, action) => {
  switch (action.type) {
    case `activateRepo_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
        active: true,
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
    case `activateRepo_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
        repos: state.repos.map(repo => {
          if (repo._id === action.result._id) {
            return repoReducer(repo, action)
          }
          return repo
        }),
      }
    default:
      return state
  }
}
