import { actions } from './reducer'
import { matchRoute } from './routes'

export default ({ dispatch, getState }) => next => action => {
  next(action)
  if (action.type === '@@router/LOCATION_CHANGE') {
    const path = getState().router.location.pathname
    const match = matchRoute({ path })
    if (match) {
      const { route, params } = match
      dispatch(actions.emit({ route, params }))
    }
  }
}
