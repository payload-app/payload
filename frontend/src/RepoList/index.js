import { connect } from 'react-redux'
import RepoList from './components/RepoList'
import { selector } from './reducer'

export default connect(state => ({
  repos: state[selector].repos,
}), ({dispatch}) => ({
  onActivateClick: ({ repo }) => console.log(repo),
}))(RepoList)

export { default as middleware } from './middleware'
export { default as reducer, selector } from './reducer'
