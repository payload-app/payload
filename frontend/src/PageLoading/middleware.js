import { push } from 'react-router-redux'
import {
  actionTypes as dataFetchActionTypes,
  actions as dataFetchActions,
} from '@hharnisc/async-data-fetch'
import {
  actionTypes as routingActionTypes,
  routes,
  baseRoute,
} from '../Routing'
import { actions as storeActions } from '../StorePackage'

export default ({ dispatch }) => next => action => {
  next(action)
  switch (action.type) {
    case routingActionTypes.EMIT:
      if (action.route === routes.INIT) {
        // wait a second for transition to catch up
        setTimeout(() => {
          dispatch(
            dataFetchActions.fetch({
              name: 'syncOrganizations',
              args: {
                init: true,
              },
            }),
          )
        }, 2000)
      }
      break
    case `syncOrganizations_${dataFetchActionTypes.FETCH_SUCCESS}`:
      if (action.args.init) {
        // wait a second for transition to catch up
        setTimeout(() => {
          dispatch(
            dataFetchActions.fetch({
              name: 'syncRepos',
              args: {
                init: true,
              },
            }),
          )
        }, 2000)
      }
      break
    case `syncRepos_${dataFetchActionTypes.FETCH_SUCCESS}`:
      if (action.args.init) {
        // re-init applicaton
        dispatch(storeActions.appInit())
        dispatch(push(baseRoute()))
      }
      break
    default:
      break
  }
}
