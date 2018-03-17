import { actions, selector } from './reducer'
import { matchRoute } from './routes'

export default ({ dispatch, getState }) => next => action => {
  const state = getState()
  const { route: previousRoute, params: previousParams } = state[selector]
  const previousPath = state.router.location
    ? state.router.location.pathname
    : undefined
  next(action)
  if (action.type === '@@router/LOCATION_CHANGE') {
    const path = getState().router.location.pathname
    const match = matchRoute({ path })
    const { route: curRoute, params: curParams } = getState()[selector]
    if (match) {
      const { route, params } = match
      if (
        route !== curRoute ||
        JSON.stringify(params) !== JSON.stringify(curParams)
      ) {
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
      }
    }
  }
}
