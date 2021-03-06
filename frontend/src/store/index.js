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
  reducer as storeReducer,
  actions as storeActions,
  selector as storeSelector,
  middleware as storeMiddleware,
} from '../StorePackage'
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
import {
  middleware as routingMiddleware,
  selector as routingSelector,
  reducer as routingReducer,
} from '../Routing'
import {
  middleware as runMiddleware,
  selector as pageRunSelector,
  reducer as pageRunReducer,
} from '../PageRun'
import { middleware as loadingMiddleware } from '../PageLoading'
import {
  selector as pageSettingsSelector,
  reducer as pageSettingsReducer,
} from '../PageSettings'
import {
  middleware as userMenuItemMiddleware,
  selector as userMenuItemSelector,
  reducer as userMenuItemReducer,
} from '../UserMenuItem'
import {
  middleware as sidebarMiddleware,
  selector as sidebarSelector,
  reducer as sidebarReducer,
} from '../Sidebar'
import {
  middleware as billingMiddleware,
  selector as billingSelector,
  reducer as billingReducer,
} from '../Billing'
import {
  middleware as pageInvitedMiddleware,
  selector as pageInvitedSelector,
  reducer as pageInvitedReducer,
} from '../PageInvited'

const logger = createLogger({ level: 'info', collapsed: true })
const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose

export const history = createHistory()
const store = createStore(
  combineReducers({
    [asyncDataFetchStoreKey]: asyncDataFetchReducer,
    [repoListSelector]: repoListReducer,
    [headerSelector]: headerReducer,
    [pageRunSelector]: pageRunReducer,
    [pageSettingsSelector]: pageSettingsReducer,
    [routingSelector]: routingReducer,
    [userMenuItemSelector]: userMenuItemReducer,
    [sidebarSelector]: sidebarReducer,
    [billingSelector]: billingReducer,
    [storeSelector]: storeReducer,
    [pageInvitedSelector]: pageInvitedReducer,
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
      repoListMiddleware,
      headerMiddleware,
      unauthorizedRedirectMiddleware,
      routingMiddleware,
      runMiddleware,
      loadingMiddleware,
      userMenuItemMiddleware,
      sidebarMiddleware,
      billingMiddleware,
      storeMiddleware,
      pageInvitedMiddleware,
      logger,
    ),
  ),
)

store.dispatch(storeActions.appInit())

export default store
