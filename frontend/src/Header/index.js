import { connect } from 'react-redux'
import Header from './components/Header'

export const storeKey = 'Header'

export default connect(state => ({
  title: state[storeKey].title,
  subtitle: state[storeKey].subtitle,
}))(Header)

export reducer, { actions, actionTypes } from './reducer'
