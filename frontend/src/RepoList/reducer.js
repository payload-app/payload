import { actionTypes as dataFetchActionTypes } from '@hharnisc/async-data-fetch'

export const selector = 'RepoList'

const initialState = {
  repos: [],
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
    default:
      return state
  }
}
