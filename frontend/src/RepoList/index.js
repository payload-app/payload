import { connect } from 'react-redux'
import { actions as dataFetchActions } from '@hharnisc/async-data-fetch'
import RepoList from './components/RepoList'
import { selector } from './reducer'

export default connect(
  state => ({
    repos: state[selector].repos,
  }),
  dispatch => ({
    onActivateClick: ({ repo }) =>
      dispatch(
        dataFetchActions.fetch({
          name: 'activateRepo',
          args: {
            owner: repo.owner,
            repo: repo.repo,
            type: repo.type,
          },
        }),
      ),
  }),
)(RepoList)

export { default as middleware } from './middleware'
export { default as reducer, selector } from './reducer'
