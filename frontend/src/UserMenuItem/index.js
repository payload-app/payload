import { connect } from 'react-redux'
import UserMenuItem from './components/UserMenuItem'
import { selector } from './reducer'

export default connect(
  state => ({ user: state[selector].user }),
  () => ({
    onSettingsClick: () => console.log('onSettingsClick'),
    onLogoutClick: () => console.log('onLogoutClick'),
  }),
)(UserMenuItem)

export { default as reducer, selector } from './reducer'
export { default as middleware } from './middleware'
