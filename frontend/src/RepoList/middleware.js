import { actions as dataFetchActions } from '@hharnisc/async-data-fetch'
import {
  selector as routingSelector,
  actionTypes as routerActionTypes,
  routes,
} from '../Routing'

export default ({ dispatch, getState }) => next => action => {
  next(action)
  switch (action.type) {
    case routerActionTypes.EMIT:
      const state = getState()
      const { route, params } = state[routingSelector]
      if (route === routes.REPO_LIST) {
        dispatch(
          dataFetchActions.fetch({
            name: 'repos',
            args: {
              name: params.owner,
              ownerType: params.ownerType,
            },
          }),
        )
      }
      break
    default:
      break
  }
}
