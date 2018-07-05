import {
  actions as dataFetchActions,
  actionTypes as dataFetchActionTypes,
} from '@hharnisc/async-data-fetch'
import {
  actionTypes as storeActionTypes,
  actions as storeActions,
} from './reducer'
import { selector as sidebarSelector } from '../Sidebar'
import { selector as billingSelector } from '../Billing'
import { selector as userMenuItemSelector } from '../UserMenuItem'

export default ({ dispatch, getState }) => next => action => {
  next(action)
  const initComplete = () => {
    const {
      [sidebarSelector]: { repoOwners },
      [billingSelector]: { stripePublicKey },
      [userMenuItemSelector]: { user },
    } = getState()
    return repoOwners.length && stripePublicKey && user
  }
  switch (action.type) {
    case storeActionTypes.APP_INIT:
      dispatch(
        dataFetchActions.fetch({
          name: 'repoOwners',
        }),
      )
      dispatch(
        dataFetchActions.fetch({
          name: 'getStripePublicKey',
        }),
      )
      dispatch(
        dataFetchActions.fetch({
          name: 'getUser',
        }),
      )
      break
    case `repoOwners_${dataFetchActionTypes.FETCH_SUCCESS}`:
      if (initComplete()) {
        dispatch(storeActions.appInitComplete())
      }
      break
    case `getStripePublicKey_${dataFetchActionTypes.FETCH_SUCCESS}`:
      if (initComplete()) {
        dispatch(storeActions.appInitComplete())
      }
      break
    case `getUser_${dataFetchActionTypes.FETCH_SUCCESS}`:
      if (initComplete()) {
        dispatch(storeActions.appInitComplete())
      }
      break
    default:
      break
  }
}
