import React from 'react'
import * as actions from './store/actions'
import { connect } from 'react-redux'

export class App extends React.Component {
  componentDidMount() {
    this.props.onLoad()
  }

  render() {
    return <div>Payload</div>
  }
}

export default connect(() => ({}), {
  onLoad: () => dispatch => {
    dispatch(actions.fetchSavedRepos)
    dispatch(actions.fetchGithubRepos)
  },
})(App)
