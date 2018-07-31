import { connect } from 'react-redux'
import PageInvited from './components/PageInvited'
import { selector } from './reducer'
export default connect(state => ({
  invitesBefore: state[selector].invitesBefore,
  invitesAfter: state[selector].invitesAfter,
}))(PageInvited)

export { default as middleware } from './middleware'
export { default as reducer, selector, actionTypes, actions } from './reducer'
