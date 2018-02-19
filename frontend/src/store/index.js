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
import { middleware as unauthorizedRedirectMiddleware } from '../UnauthorizedRedirect'
import { middleware as routingMiddleware } from '../Routing'

const logger = createLogger({ level: 'info', collapsed: true })
const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose

export const history = createHistory()

export default createStore(
  combineReducers({
    [asyncDataFetchStoreKey]: asyncDataFetchReducer,
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
      repoSelectorMiddleware,
      repoListMiddleware,
      headerMiddleware,
      unauthorizedRedirectMiddleware,
      routingMiddleware,
      logger,
    ),
  ),
)
