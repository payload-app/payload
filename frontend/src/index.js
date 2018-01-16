// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import App from './App'
import * as guard from './helpers/guards'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  guard.getElementById('root'),
)
