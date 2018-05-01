import { connect } from 'react-redux'

import PageBilling from './components/PageBilling'

export default connect(
  state => ({
    stripeKey: process.env.STRIPE_API_KEY,
  }),
)(PageBilling)
