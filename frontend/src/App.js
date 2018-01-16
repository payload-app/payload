// @flow
import type { RepoList } from 'api-types'
import React from 'react'
import * as actions from './store/actions'
import { connect } from 'react-redux'
import { getTokenFromUrl } from '@middleware/github-api'
import { selectors as repoSelectors } from './store/repos'

type Props = {
  onLoad: () => void,
  repos: RepoList,
}

export class App extends React.Component<Props> {
  componentDidMount() {
    getTokenFromUrl(window.location.search).then(() => this.props.onLoad())
  }

  render() {
    const { repos = [] } = this.props
    return (
      <div>
        Payload
        <br />
        <a href="http://localhost:8088/login">Github Auth</a>
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
  {
    onLoad: () => dispatch => {
      dispatch(actions.fetchSavedRepos)
      dispatch(actions.fetchGithubRepos)
    },
  },
)(App)
