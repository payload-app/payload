import { connect } from 'react-redux'
import { actions as dataFetchActions } from '@hharnisc/async-data-fetch'
import { selector } from './reducer'
import Settings from './components/Settings'

export default connect(
  state => ({
    organizationsLoading: state[selector].sync.organizations.loading,
    repositoriesLoading: state[selector].sync.repositories.loading,
  }),
  dispatch => ({
    onResyncOrgsClick: () =>
      dispatch(
        dataFetchActions.fetch({
          name: 'syncOrganizations',
        }),
      ),
    onResyncReposClick: () =>
      dispatch(
        dataFetchActions.fetch({
          name: 'syncRepos',
        }),
      ),
  }),
)(Settings)

export { default as reducer, selector } from './reducer'
