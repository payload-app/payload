// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import store, { history } from './store'
import { getElementById } from './helpers/guards'

import { ConnectedRouter as Router } from 'react-router-redux'
import { Provider } from 'react-redux'
import Pages from './Pages'

store.dispatch({ type: 'APP_INIT' })

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Pages />
    </Router>
  </Provider>,
  getElementById('root'),
)
