import { connect } from 'react-redux'
import { selector } from './reducer'
import PageBilling from './components/PageBilling'

export default connect(state => ({
  customers: state[selector].customers,
}))(PageBilling)

export { default as middleware } from './middleware'
export { default as reducer, selector } from './reducer'
