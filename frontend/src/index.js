// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import store, { history } from './store'
import { getElementById } from './helpers/guards'

import { Layout } from './layout'
import { ConnectedRouter as Router } from 'react-router-redux'
import { Provider } from 'react-redux'
import Pages from './pages'

store.dispatch({ type: 'APP_INIT' })

ReactDOM.render(
  <Provider store={store}>
    <Layout>
      <Router history={history}>
        <Pages />
      </Router>
    </Layout>
  </Provider>,
  getElementById('root'),
)
