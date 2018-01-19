import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { createLogger } from 'redux-logger'
import {
  reducer as asyncDataFetchReducer,
  storeKey as asyncDataFetchStoreKey,
  middleware as asyncDataFetchMiddleware,
} from '@hharnisc/async-data-fetch'
import { reducer as reposReducer, storeKey as reposStoreKey } from './repos'
import thunk from 'redux-thunk'

const logger = createLogger({ level: 'info', collapsed: true })
const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose

export default createStore(
  combineReducers({
    [asyncDataFetchStoreKey]: asyncDataFetchReducer,
    [reposStoreKey]: reposReducer,
  }),
  {},
  composeEnhancers(
    applyMiddleware(
      asyncDataFetchMiddleware({
        rpcClientOptions: {
          url: 'http://localhost:8081/rpc', // TODO: prod host
        },
      }),
      logger,
      thunk,
    ),
  ),
)
