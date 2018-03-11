import { connect } from 'react-redux'
import { actions as dataFetchActions } from '@hharnisc/async-data-fetch'
import { push } from 'react-router-redux'
import { generateOwnerSettingsRoute } from '../Routing'
import UserMenuItem from './components/UserMenuItem'
import { selector } from './reducer'

export default connect(
  state => ({ user: state[selector].user }),
  dispatch => ({
    onSettingsClick: ({ user }) => {
      dispatch(
        push(
          generateOwnerSettingsRoute({
            type: 'github',
            ownerType: 'user',
            owner: user.accounts.github.username,
            settingsType: 'sync',
          }),
        ),
      )
    },
    onLogoutClick: () =>
      dispatch(
        dataFetchActions.fetch({
          name: 'logout',
        }),
      ),
  }),
)(UserMenuItem)

export { default as reducer, selector } from './reducer'
export { default as middleware } from './middleware'
