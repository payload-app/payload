import { connect } from 'react-redux'
import { Header } from '@payloadapp/components'
import { selector } from './reducer'

export default connect(state => ({
  title: state[selector].title,
  subtitle: state[selector].subtitle,
  warning: state[selector].warning,
  loading: state[selector].loading,
}))(Header)

export { default as reducer, actions, actionTypes, selector } from './reducer'
export { default as middleware } from './middleware'
