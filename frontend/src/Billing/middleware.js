import {
  actions as dataFetchActions,
  actionTypes as dataFetchActionTypes,
} from '@hharnisc/async-data-fetch'
import {
  actionTypes as sidebarActionTypes,
  selector as sidebarSelector,
} from '../Sidebar'
import {
  selector as routingSelector,
  routes,
  actionTypes as routingActionTypes,
} from '../Routing'

export default ({ dispatch, getState }) => next => action => {
  next(action)
  switch (action.type) {
    case routingActionTypes.EMIT: {
      const state = getState()
      const { repoOwners } = state[sidebarSelector]
      const { route, params } = state[routingSelector]
      if (
        route === routes.OWNER_SETTINGS &&
        params.settingsType === 'billing'
      ) {
        dispatch(
          dataFetchActions.fetch({
            name: 'getBillingCustomers',
            args: {
              owners: repoOwners.map(owner => ({
                ownerId: owner.id,
                ownerType: owner.ownerType,
              })),
            },
          }),
        )
      }
      break
    }
    case sidebarActionTypes.SELECT: {
      const state = getState()
      const { repoOwners } = state[sidebarSelector]
      const { route } = state[routingSelector]
      if (route === routes.REPO_LIST) {
        dispatch(
          dataFetchActions.fetch({
            name: 'getBillingCustomer',
            args: {
              ownerId: repoOwners[action.selection].id,
              ownerType: repoOwners[action.selection].ownerType,
            },
          }),
        )
      }
      break
    }
    case `deactivateRepo_${dataFetchActionTypes.FETCH_SUCCESS}`:
    case `setPaymentSource_${dataFetchActionTypes.FETCH_SUCCESS}`:
      dispatch(
        dataFetchActions.fetch({
          name: 'getBillingCustomer',
          args: {
            ownerId: action.args.ownerId,
            ownerType: action.args.ownerType,
          },
        }),
      )
      break
    case `getBillingCustomers_${dataFetchActionTypes.FETCH_SUCCESS}`:
      const ids = action.result
        .map(customer => customer.subscriptions.map(sub => sub.repoId))
        .reduce((idArray, newRepoIds) => [...idArray, ...newRepoIds], [])
      dispatch(
        dataFetchActions.fetch({
          name: 'getRepos',
          args: {
            ids,
          },
        }),
      )
      break
    default:
      break
  }
}
