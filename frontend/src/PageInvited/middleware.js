import Cookies from 'js-cookie'
import { push } from 'react-router-redux'
import fetch from 'isomorphic-fetch'
import { actions } from './reducer'
import {
  actionTypes as routingActionTypes,
  routes,
  invitedRoute,
} from '../Routing'

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
          if (response.status !== 200) {
            throw new Error('There was an error fetching the invite status')
          }
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
      }
    case routingActionTypes.QUEUED_EMIT:
      // redirect to /invited/ if BASE route and have payload_invite cookie
      if (action.route === routes.BASE) {
        if (Cookies.get('payload_invite')) {
          // HACK: queue up the dispatch after middware has completed
          // ALSO, don't copy this pattern if you find this.
          // Expecting this to be delete after invites aren't needed
          setTimeout(() => dispatch(push(invitedRoute())), 0)
        }
      }
      break
    default:
      break
  }
}
