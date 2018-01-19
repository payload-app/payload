// @flow
import type { RepoList, Repo, ListGithubRepoArgs } from 'api-types'
import { actions as asyncDataFetchActions } from '@hharnisc/async-data-fetch'
import { arrayToKeyedObj } from '../helpers/transformers'

export const fetchSavedRepos = asyncDataFetchActions.fetch({
  name: 'listRepos',
  format: (results: RepoList) => ({
    repos: arrayToKeyedObj(results, 'repoId'),
  }),
})

export const fetchGithubRepos = ({ token }: ListGithubRepoArgs) =>
  asyncDataFetchActions.fetch({
    name: 'listGithubRepos',
    args: { token },
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
        repos: arrayToKeyedObj(strippedDownRepoData, 'repoId'),
      }
    },
  })
