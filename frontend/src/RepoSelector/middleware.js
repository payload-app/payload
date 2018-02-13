import {
  actions as dataFetchActions,
  actionTypes as dataFetchActionTypes,
} from '@hharnisc/async-data-fetch'
import { actions } from './reducer'

export default ({ dispatch }) => next => action => {
  next(action)
  switch (action.type) {
    case 'APP_INIT':
      dispatch(
        dataFetchActions.fetch({
          name: 'repoOwners',
        }),
      )
    case `repoOwners_${dataFetchActionTypes.FETCH_SUCCESS}`:
      if (action.result && action.result.length > 0) {
        dispatch(actions.setValue({ value: action.result[0] }))
      }
    default:
      break
  }
}
