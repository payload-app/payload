import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import RepoSelector from './components/RepoSelector'
import { selector, actions } from './reducer'

export default connect(
  state => ({
    repoOwners: state[selector].repoOwners,
    value: state[selector].value,
  }),
  dispatch => ({
    onChange: ({ value }) => dispatch(actions.setValue({ value })),
  }),
)(RepoSelector)

export { default as middleware } from './middleware'
export { default as reducer, actions, actionTypes, selector } from './reducer'
