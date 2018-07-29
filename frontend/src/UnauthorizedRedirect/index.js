import { actionTypes } from '@hharnisc/async-data-fetch'
import { push } from 'react-router-redux'
import { authRoute, routes, selector as routingSelector } from '../Routing'

export const middleware = ({ dispatch, getState }) => next => action => {
  next(action)
  if (
    action.type.endsWith(actionTypes.FETCH_FAIL) &&
    action.error === 'Unauthorized'
  ) {
    const { route } = getState()[routingSelector]
    if (route !== routes.AUTH) {
      dispatch(push(authRoute()))
    }
  }
}
