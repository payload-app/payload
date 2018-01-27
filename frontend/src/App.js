// @flow
import type { RepoList } from 'api-types'
import React from 'react'
import { connect } from 'react-redux'
import { getTokenFromUrl } from '@middleware/github-api'
import { selectors as repoSelectors, actions as repoActions } from './repos'

type Props = {
  fetchRepos: ({ token: string }) => void,
  repos: RepoList,
}

export class App extends React.Component<Props> {
  componentDidMount() {
    getTokenFromUrl(window.location.search).then(token =>
      this.props.fetchRepos({ token }),
    )
  }

  render() {
    const { repos = [] } = this.props
    return (
      <div>
        Payload
        <br />
        <a href="/login">Github Auth</a>
        <br />
        {repos.map(repo => <div key={repo.repoId}>{repo.name}</div>)}
      </div>
    )
  }
}

export default connect(
  state => ({
    repos: repoSelectors.getReposSortedActiveFirst({ state }),
  }),
  { fetchRepos: repoActions.fetchRepos },
)(App)
