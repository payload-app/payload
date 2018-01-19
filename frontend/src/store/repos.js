// @flow
import type { Repo } from 'api-types'
import { toValues } from '../helpers/transformers'
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

export const selectors = {
  getRepos: ({ state }: Object) => toValues(state[storeKey]),
  getReposSortedActiveFirst: ({ state }: Object) => {
    const repos = selectors.getRepos({ state })
    return repos && repos.sort((repo: Repo) => (repo.active ? -1 : 1))
  },
}
