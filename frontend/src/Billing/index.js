import { connect } from 'react-redux'
import { selector } from './reducer'
import BillingList from './components/BillingList'

export default connect(state => ({
  customers: state[selector].customers,
}))(BillingList)

export { default as middleware } from './middleware'
export { default as reducer, selector } from './reducer'
