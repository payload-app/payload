import { connect } from 'react-redux'
import Header from './components/Header'

export reducer, { actions, actionTypes, selector } from './reducer'
export default connect(state => ({
  title: state[selector].title,
  subtitle: state[selector].subtitle,
}))(Header)
