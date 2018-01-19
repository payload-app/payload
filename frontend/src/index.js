// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import App from './App'
import { getElementById } from './helpers/guards'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  getElementById('root'),
)
