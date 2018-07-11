import { connect } from 'react-redux'
import { actions as dataFetchActions } from '@hharnisc/async-data-fetch'
import UserMenuItem from './components/UserMenuItem'
import { selector, actions } from './reducer'

export default connect(
  state => ({ user: state[selector].user }),
  dispatch => ({
    onSettingsClick: () => {
      dispatch(actions.settingsClick())
    },
    onLogoutClick: () =>
      dispatch(
        dataFetchActions.fetch({
          name: 'logout',
        }),
      ),
  }),
)(UserMenuItem)

export { default as reducer, selector, actions, actionTypes } from './reducer'
export { default as middleware } from './middleware'
