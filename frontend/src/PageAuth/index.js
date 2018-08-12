import { connect } from 'react-redux'
import Auth from './components/Auth'
import { selector as routingSelector } from '../Routing'

export default connect(state => ({
  email: state[routingSelector].params.email,
  inviteToken: state[routingSelector].params.inviteToken,
  errorCode: state[routingSelector].params.errorCode,
}))(Auth)
