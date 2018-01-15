// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store'
import { actions as asyncDataFetchActions } from '@hharnisc/async-data-fetch'
import App from './App';
import type { RepoList } from 'api-types'
import * as transform from './helpers/transformers'
import * as guard from './helpers/guards'

// EXAMPLE: fetch for list repo, check Redux dev tools and
// network tab for the request
store.dispatch(asyncDataFetchActions.fetch({
  name: 'listRepos',
  format: (results: RepoList) =>
    transform.arrayToKeyedObj(results, 'repoId')
}))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  guard.getElementById('root')
)
