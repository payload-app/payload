import { push } from 'react-router-redux'
import { authRoute } from '../Routing'
import {
  actionTypes as dataFetchActionTypes,
  actions as dataFetchActions,
} from '@hharnisc/async-data-fetch'

export default ({ dispatch }) => next => action => {
  next(action)
  switch (action.type) {
    case 'Store/APP_INIT':
      dispatch(
        dataFetchActions.fetch({
          name: 'getUser',
        }),
      )
      break
    case `logout_${dataFetchActionTypes.FETCH_SUCCESS}`:
      dispatch(push(authRoute()))
      break
    default:
      break
  }
}
