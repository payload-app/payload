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
    case `getUser_${dataFetchActionTypes.FETCH_SUCCESS}`:
      break
    default:
      break
  }
}
