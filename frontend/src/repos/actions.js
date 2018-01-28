// @flow
import type { Repo, ListGithubRepoArgs } from 'api-types'
import { actions as asyncDataFetchActions } from '@hharnisc/async-data-fetch'

import { arrayToKeyedObj } from '../helpers/transformers'

export const actionTypes = {
  FETCH_REPOS: 'REPOS/FETCH_REPOS',
}

export const actions = {
  fetchRepos: () => ({
    type: actionTypes.FETCH_REPOS,
  }),
  fetchSavedRepos: () =>
    asyncDataFetchActions.fetch({
      name: 'listRepos',
      format: results => ({
        repos: arrayToKeyedObj(results, (repo: Repo) => repo.repoId),
      }),
    }),
  fetchGithubRepos: () =>
    asyncDataFetchActions.fetch({
      name: 'listGithubRepos',
      format: results => {
        const strippedDownRepoData = results.map(
          repo =>
            ({
              name: repo.full_name,
              repoId: repo.id,
              active: false,
            }: Repo),
        )
        return {
          repos: arrayToKeyedObj(
            strippedDownRepoData,
            (repo: Repo) => repo.repoId,
          ),
        }
      },
    }),
}
