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
          // TODO - make client only args
          args: {
            page: 'sync',
          },
        }),
      ),
    onResyncReposClick: () =>
      dispatch(
        dataFetchActions.fetch({
          name: 'syncRepos',
          // TODO - make client only args
          args: {
            page: 'sync',
          },
        }),
      ),
  }),
)(Settings)

export { default as reducer, selector } from './reducer'
