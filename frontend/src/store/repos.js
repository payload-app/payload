// @flow
import type { RepoList, Repo } from 'api-types'
import { FETCH_REPOS } from './actions'
import { status as GITHUB_API_STATUS } from '@middleware/github-api'

export const storeKey = 'repos'

type State = { [number]: Repo }

export const reducer = (state: State = {}, action: any) => {
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

// Flow Hack for poorly typed Object.values()
const values = obj => Object.keys(obj).map(key => obj[key])

export const selectors = {
  getRepos: ({ state }: any): RepoList => values(state[storeKey]),
  getReposSortedActiveFirst: ({ state }: any): RepoList => {
    const repos = selectors.getRepos({ state })
    return repos && repos.sort(repo => (repo.active ? 1 : 0))
  },
}
