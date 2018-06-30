import { actions as dataFetchActions } from '@hharnisc/async-data-fetch'
import {
  actionTypes as sidebarActionTypes,
  selector as sidebarSelector,
} from '../Sidebar'
import { selector as routingSelector, routes } from '../Routing'

export default ({ dispatch, getState }) => next => action => {
  next(action)
  switch (action.type) {
    case sidebarActionTypes.SELECT:
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
    default:
      break
  }
}
