// @flow
import type { RepoList, Repo } from 'api-types'

export const storeKey = 'repos'

type State = { [number]: Repo }

export const reducer = (state: State = {}, action: any) => {
  switch (action.type) {
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
