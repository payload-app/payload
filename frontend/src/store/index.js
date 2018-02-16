import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { createLogger } from 'redux-logger'
import createHistory from 'history/createBrowserHistory'
import { routerReducer, routerMiddleware } from 'react-router-redux'
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
import {
  reducer as layoutReducer,
  storeKey as layoutStoreKey,
  // middleware as layoutMiddleware,
} from '../layout'
import {
  reducer as repoSelectorReducer,
  selector as repoSelectorSelector,
  middleware as repoSelectorMiddleware,
} from '../RepoSelector'
import {
  reducer as repoListReducer,
  selector as repoListSelector,
  middleware as repoListMiddleware,
} from '../RepoList'
import {
  reducer as headerReducer,
  selector as headerSelector,
  middleware as headerMiddleware,
} from '../Header'

const logger = createLogger({ level: 'info', collapsed: true })
const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose

export const history = createHistory()

export default createStore(
  combineReducers({
    [asyncDataFetchStoreKey]: asyncDataFetchReducer,
    [repoStoreKey]: repoReducer,
    [layoutStoreKey]: layoutReducer,
    [repoSelectorSelector]: repoSelectorReducer,
    [repoListSelector]: repoListReducer,
    [headerSelector]: headerReducer,
    router: routerReducer,
  }),
  {},
  composeEnhancers(
    applyMiddleware(
      routerMiddleware(history),
      asyncDataFetchMiddleware({
        rpcClientOptions: {
          url: '/api/rpc',
          sendCredentials: 'same-origin',
        },
      }),
      repoMiddleware,
      repoSelectorMiddleware,
      repoListMiddleware,
      headerMiddleware,
      logger,
    ),
  ),
)
