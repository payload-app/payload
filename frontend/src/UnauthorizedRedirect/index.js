import { actionTypes } from '@hharnisc/async-data-fetch'
import { push } from 'react-router-redux'
import { authRoute } from '../Routing'

export const middleware = ({ dispatch }) => next => action => {
  next(action)
  if (
    action.type.endsWith(actionTypes.FETCH_FAIL) &&
    action.error === 'Unauthorized'
  ) {
    dispatch(push(authRoute()))
  }
}
