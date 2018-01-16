// @flow
import type { RepoList, Repo } from 'api-types'
import { actions as asyncDataFetchActions } from '@hharnisc/async-data-fetch'
import * as transform from '../helpers/transformers'
import { GITHUB_API } from './github-api-middleware'

export const FETCH_REPOS = 'FETCH_REPOS'

export const fetchSavedRepos = asyncDataFetchActions.fetch({
  name: 'listRepos',
  format: (results: RepoList) => transform.arrayToKeyedObj(results, 'repoId'),
})

export const fetchGithubRepos = {
  [GITHUB_API]: {
    endpoint: 'users/casesandberg/repos',
    type: FETCH_REPOS,
    transform: results => {
      const repos = results.map(
        repo =>
          ({
            name: repo.full_name,
            repoId: repo.id,
            active: false,
          }: Repo),
      )
      return { repos: transform.arrayToKeyedObj(repos, 'repoId') }
    },
  },
}
