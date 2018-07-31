import fetch from 'isomorphic-fetch'
import { actions } from './reducer'
import { actionTypes as routingActionTypes, routes } from '../Routing'

export default ({ dispatch }) => next => async action => {
  next(action)
  switch (action.type) {
    case routingActionTypes.EMIT:
      if (action.route === routes.INVITED) {
        dispatch(actions.fetchStart())
        try {
          // make a request to /api/invite/status with payload_invite cookie
          const response = await fetch('/api/invite/status', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
          })
          const result = await response.json()
          dispatch(
            actions.fetchSuccess({
              result,
            }),
          )
        } catch (error) {
          dispatch(
            actions.fetchFail({
              error: error.message,
            }),
          )
        }
      } else if (action.route === routes.BASE) {
        // redirect to /invited/ if BASE route and have payload_invite cookie
      }
      break
    default:
      break
  }
}
