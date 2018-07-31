import Cookies from 'js-cookie'
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
    if (
      !(
        route === routes.AUTH ||
        route === routes.INVITED ||
        Cookies.get('payload_invite')
      )
    ) {
      dispatch(push(authRoute()))
    }
    // if route === routes.BASE and have payload_invite cookie don't redirect
  }
}
