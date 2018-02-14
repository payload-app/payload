// @flow
// import type { RepoList } from 'api-types'
import React from 'react'
import { connect } from 'react-redux'
import { selectors as repoSelectors, actions as repoActions } from '../repos'

import { Page } from '../layout'
import RepoSelector from '../RepoSelector'
import RepoList from '../RepoList'
import { Link } from 'react-router-dom'

// type Props = {
//   fetchRepos: () => void,
//   repos: RepoList,
// }

export const List = ({ repos = [], fetchRepos }: Props) => {
  return (
    <Page
      headline="Mission Dashboard"
      subhead={`Tracking ${repos.length} Repositories...`}
      fetch={({ done }) => {
        // fetchRepos()
        // setTimeout(done, 3000)
      }}
    >
      {() => (
        <div>
          <Link to="/login">Auth</Link>
          <div>
            <RepoSelector />
          </div>
          <div>
            <RepoList />
          </div>
        </div>
      )}
    </Page>
  )
}

export default connect(
  state => ({
    repos: repoSelectors.getReposSortedActiveFirst({ state }),
  }),
  { fetchRepos: repoActions.fetchRepos },
)(List)
