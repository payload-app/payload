import { connect } from 'react-redux'
import { selector } from './reducer'
import { selector as sidebarSelector } from '../Sidebar'
import BillingList from './components/BillingList'

export default connect(state => ({
  billingCustomers: state[selector].customers,
  repoOwners: state[sidebarSelector].repoOwners,
  loading: state[selector].loadingActiveRepos,
}))(BillingList)

export { default as middleware } from './middleware'
export { default as reducer, selector } from './reducer'
