import { actions as headerActions } from '../Header'
import { selector as repoListSelector } from '../RepoList'
import { actionTypes as routingActionTypes, routes } from '../Routing'
import { actionTypes as dataFetchActionTypes } from '@hharnisc/async-data-fetch'

export default ({ dispatch, getState }) => next => action => {
  next(action)
  switch (action.type) {
    case routingActionTypes.EMIT:
      if (action.route === routes.REPO_LIST) {
        dispatch(headerActions.setTitle({ title: 'Payload Dashboard' }))
        dispatch(headerActions.setSubtitle({ subtitle: 'Loading...' }))
      }
      break
    case `repos_${dataFetchActionTypes.FETCH_START}`:
      dispatch(headerActions.setSubtitle({ subtitle: 'Loading...' }))
      break
    case `activateRepo_${dataFetchActionTypes.FETCH_SUCCESS}`:
    case `activateRepo_${dataFetchActionTypes.FETCH_FAIL}`:
    case `repos_${dataFetchActionTypes.FETCH_SUCCESS}`:
      const count = getState()[repoListSelector].repos.reduce((count, repo) => {
        if (repo.active) {
          return count + 1
        }
        return count
      }, 0)
      dispatch(
        headerActions.setSubtitle({
          subtitle: `Tracking ${count} Repositor${
            count === 1 ? 'y' : 'ies'
          }...`,
        }),
      )
      break
    case `activateRepo_${dataFetchActionTypes.FETCH_START}`:
      dispatch(
        headerActions.setSubtitle({ subtitle: 'Activating Repository...' }),
      )
      break
    default:
      break
  }
}
