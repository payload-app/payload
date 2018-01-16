import React from 'react'
import * as actions from './store/actions'
import { connect } from 'react-redux'
import { getTokenFromUrl } from './store/github-api-middleware'

export class App extends React.Component {
  componentDidMount() {
    getTokenFromUrl(window.location.search).then(() => this.props.onLoad())
  }

  render() {
    return (
      <div>
        Payload
        <br />
        <a href="http://localhost:8088/login">Github Auth</a>
      </div>
    )
  }
}

export default connect(() => ({}), {
  onLoad: () => dispatch => {
    dispatch(actions.fetchSavedRepos)
    dispatch(actions.fetchGithubRepos)
  },
})(App)
