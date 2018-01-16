import { FETCH_REPOS } from './actions'
import { status as GITHUB_API_STATUS } from './github-api-middleware'

export const reducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_REPOS: {
      if (GITHUB_API_STATUS.SUCCESS) {
        return {
          ...state,
          ...action.repos,
        }
      }
      return state
    }
    default:
      return state
  }
}

export const selectors = {}
