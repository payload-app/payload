// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store'
import { actions as asyncDataFetchActions } from './store/async-data-fetch-middleware'
import App from './App';
import type { listReposReturnType } from 'payload-api-types'
import * as formatters from './helpers/formatters'
import * as guards from './helpers/guards'

// EXAMPLE: fetch for list repo, check Redux dev tools and
// network tab for the request
store.dispatch(asyncDataFetchActions.fetch({
  name: 'listRepos',
  format: (results: listReposReturnType) =>
    formatters.arrayToKeyedObj(results, 'repoId')
}))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  guards.getElementById('root')
)
