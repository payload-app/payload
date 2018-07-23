import { connect } from 'react-redux'
import ImpersonationHeader from './components/ImpersonationHeader'
import { selector as userMenuItemSelector } from '../UserMenuItem'
import { userIsImpersonating } from './utils'

export default connect(state => ({
  user: state[userMenuItemSelector].user,
  impersonating: userIsImpersonating(),
}))(ImpersonationHeader)
