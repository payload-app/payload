import { push } from 'react-router-redux'
import {
  authRoute,
  selector as routingSelector,
  generateOwnerSettingsRoute,
} from '../Routing'
import { actionTypes as dataFetchActionTypes } from '@hharnisc/async-data-fetch'
import { actionTypes } from './reducer'

export default ({ dispatch, getState }) => next => action => {
  next(action)
  switch (action.type) {
    case `logout_${dataFetchActionTypes.FETCH_SUCCESS}`:
      dispatch(push(authRoute()))
      break
    case actionTypes.SETTINGS_CLICK:
      const { params: { type, ownerType, owner } } = getState()[routingSelector]
      dispatch(
        push(
          generateOwnerSettingsRoute({
            type,
            ownerType,
            owner,
            settingsType: 'sync',
          }),
        ),
      )
      break
    default:
      break
  }
}
