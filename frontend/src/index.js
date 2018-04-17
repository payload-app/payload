// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import store, { history } from './store'
import { getElementById } from './helpers/guards'

import { ConnectedRouter as Router } from 'react-router-redux'
import { Provider } from 'react-redux'
import { StripeProvider } from 'react-stripe-elements'
import Pages from './Pages'

ReactDOM.render(
  <Provider store={store}>
    <StripeProvider apiKey={process.env.STRIPE_API_KEY}>
      <Router history={history}>
        <Pages />
      </Router>
    </StripeProvider>
  </Provider>,
  getElementById('root'),
)
