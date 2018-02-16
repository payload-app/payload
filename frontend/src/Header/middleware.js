import { actions as headerActions } from '../Header'
import { listRouteRegex } from '../helpers/routing'
import { actionTypes as dataFetchActionTypes } from '@hharnisc/async-data-fetch'

export default ({ dispatch }) => next => action => {
  next(action)
  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      //  ListRoute
      if (listRouteRegex.exec(action.payload.pathname)) {
        dispatch(headerActions.setTitle({ title: 'Mission Dashboard' }))
        dispatch(headerActions.setSubtitle({ subtitle: 'Loading...' }))
      }
      break
    case `repos_${dataFetchActionTypes.FETCH_START}`:
      dispatch(headerActions.setSubtitle({ subtitle: 'Loading...' }))
      break
    case `repos_${dataFetchActionTypes.FETCH_SUCCESS}`:
      const count = action.result.reduce((count, repo) => {
        if (repo.active) {
          return count + 1
        }
        return count
      }, 0)
      dispatch(
        headerActions.setSubtitle({
          subtitle: `Tracking ${count} Repositories...`,
        }),
      )
      break
    default:
      break
  }
}
