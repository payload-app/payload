import { connect } from 'react-redux'
import RepoSelector from './components/RepoSelector'
import { selector } from './reducer'

export default connect(
  state => ({
    repoOwners: state[selector].repoOwners || [],
    value: state[selector].value,
  }),
  dispatch => ({
    onChange: value => console.log('value', value),
  }),
)(RepoSelector)

export { default as middleware } from './middleware'
export { default as reducer, actions, actionTypes, selector } from './reducer'
