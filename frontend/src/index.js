// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import store from './store'
import { getElementById } from './helpers/guards'

import { Layout } from './layout'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import Pages from './pages'

ReactDOM.render(
  <Provider store={store}>
    <Layout>
      <Router>
        <Pages />
      </Router>
    </Layout>
  </Provider>,
  getElementById('root'),
)
