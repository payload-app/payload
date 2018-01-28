import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { createLogger } from 'redux-logger'
import {
  reducer as asyncDataFetchReducer,
  storeKey as asyncDataFetchStoreKey,
  middleware as asyncDataFetchMiddleware,
} from '@hharnisc/async-data-fetch'
import {
  reducer as repoReducer,
  storeKey as repoStoreKey,
  middleware as repoMiddleware,
} from '../repos'

const logger = createLogger({ level: 'info', collapsed: true })
const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose

export default createStore(
  combineReducers({
    [asyncDataFetchStoreKey]: asyncDataFetchReducer,
    [repoStoreKey]: repoReducer,
  }),
  {},
  composeEnhancers(
    applyMiddleware(
      asyncDataFetchMiddleware({
        rpcClientOptions: {
          url: '/api/rpc',
          sendCredentials: 'same-origin',
        },
      }),
      repoMiddleware,
      logger,
    ),
  ),
)
