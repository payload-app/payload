import { actions, selector } from './reducer'
import { matchRoute } from './routes'
import {
  selector as storeSelector,
  actionTypes as storeActionTypes,
} from '../store'

export default ({ dispatch, getState }) => next => action => {
  const state = getState()
  const {
    [selector]: { route: previousRoute, params: previousParams, queue },
    [storeSelector]: { initialized },
  } = state
  const previousPath = state.router.location
    ? state.router.location.pathname
    : undefined
  next(action)
  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      const path = getState().router.location.pathname
      const match = matchRoute({ path })
      const { route: curRoute, params: curParams } = getState()[selector]
      if (match) {
        const { route, params } = match
        if (
          route !== curRoute ||
          JSON.stringify(params) !== JSON.stringify(curParams)
        ) {
          if (initialized) {
            dispatch(
              actions.emit({
                route,
                params,
                path,
                previousRoute,
                previousParams,
                previousPath,
              }),
            )
          } else {
            const {
              previousRoute: queuedPreviousRoute,
              previousParams: queuedPreviousParams,
              previousPath: queuedPreviousPath,
            } =
              queue.slice(-1) || {}

            dispatch(
              actions.queuedEmit({
                route,
                params,
                path,
                previousRoute: queuedPreviousRoute,
                previousParams: queuedPreviousParams,
                previousPath: queuedPreviousPath,
              }),
            )
          }
        }
      }
      break
    case storeActionTypes.APP_INIT_COMPLETE:
      if (queue.length) {
        queue.forEach(nav =>
          dispatch(
            actions.emit({
              route: nav.route,
              params: nav.params,
              path: nav.path,
              previousRoute: nav.previousRoute,
              previousParams: nav.previousParams,
              previousPath: nav.previousPath,
            }),
          ),
        )
        dispatch(actions.flushEmitQueue())
      }
      break
    default:
      break
  }
}
