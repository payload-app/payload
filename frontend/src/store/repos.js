// @flow
import type { RepoList, Repo } from 'api-types'
import { actionTypes as dataFetchActionTypes } from '@hharnisc/async-data-fetch'

export const storeKey = 'repos'

type State = { [number]: Repo }

export const reducer = (state: State = {}, action: any) => {
  switch (action.type) {
    case `listRepos_${dataFetchActionTypes.FETCH_SUCCESS}`:
    case `listGithubRepos_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
        ...action.result.repos,
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
    return repos && repos.sort(repo => (repo.active ? -1 : 1))
  },
}
