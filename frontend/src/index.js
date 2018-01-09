import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from 'redux';
import {
  reducer as asyncDataFetchReducer,
  middleware as asyncDataFetchMiddleware,
  storeKey as asyncDataFetchStoreKey,
  actions as asyncDataFetchActions,
} from '@hharnisc/async-data-fetch';
import App from './App';

// TODO: move the store stuff to a better spot, just through everything
// in here so to get things working
const composeEnhancers =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const store = createStore(
  combineReducers({
    [asyncDataFetchStoreKey]: asyncDataFetchReducer,
  }),
  {},
  composeEnhancers(
    applyMiddleware(
      asyncDataFetchMiddleware({
        rpcClientOptions: {
          url: "http://localhost:8081/rpc", // TODO: prod host
        }
      }),
    ),
  ),
);

// EXAMPLE: fetch for list repo, check Redux dev tools and
// network tab for the request
store.dispatch(asyncDataFetchActions.fetch({
  name: 'listRepos',
}))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
