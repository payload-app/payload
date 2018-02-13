import { actions as dataFetchActions } from '@hharnisc/async-data-fetch'

export default ({ dispatch }) => next => action => {
  next(action)
  switch (action.type) {
    case 'APP_INIT':
      dispatch(
        dataFetchActions.fetch({
          name: 'repoOwners',
        }),
      )
    default:
      break
  }
}
