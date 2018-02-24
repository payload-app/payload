import { actions as headerActions } from '../Header'
import { selector as repoListSelector } from '../RepoList'
import { actionTypes as routingActionTypes, routes } from '../Routing'
import { actionTypes as dataFetchActionTypes } from '@hharnisc/async-data-fetch'

const setSubtitleTrackingCount = ({ dispatch, getState }) => {
  const count = getState()[repoListSelector].repos.reduce((count, repo) => {
    if (repo.active) {
      return count + 1
    }
    return count
  }, 0)
  dispatch(
    headerActions.setSubtitle({
      subtitle: `Tracking ${count} Repositor${count === 1 ? 'y' : 'ies'}...`,
    }),
  )
}

export default ({ dispatch, getState }) => next => action => {
  next(action)
  switch (action.type) {
    case routingActionTypes.EMIT:
      if (action.route === routes.REPO_LIST) {
        if (getState()[repoListSelector].repos.length) {
          setSubtitleTrackingCount({
            dispatch,
            getState,
          })
        } else {
          dispatch(headerActions.setTitle({ title: 'Payload Dashboard' }))
          dispatch(headerActions.setSubtitle({ subtitle: 'Loading...' }))
        }
      }
      break
    case `repos_${dataFetchActionTypes.FETCH_START}`:
      dispatch(headerActions.setSubtitle({ subtitle: 'Loading...' }))
      break
    case `activateRepo_${dataFetchActionTypes.FETCH_SUCCESS}`:
    case `activateRepo_${dataFetchActionTypes.FETCH_FAIL}`:
    case `repos_${dataFetchActionTypes.FETCH_SUCCESS}`:
      setSubtitleTrackingCount({
        dispatch,
        getState,
      })
      break
    case `activateRepo_${dataFetchActionTypes.FETCH_START}`:
      dispatch(
        headerActions.setSubtitle({ subtitle: 'Activating Repository...' }),
      )
      break
    case `getRun_${dataFetchActionTypes.FETCH_SUCCESS}`:
      const { owner, repo, branch, sha } = action.result
      dispatch(headerActions.setTitle({ title: `${owner}/${repo}` }))
      dispatch(headerActions.setSubtitle({ subtitle: `${branch} » ${sha}` }))
      break
    case `getRun_${dataFetchActionTypes.FETCH_START}`:
      dispatch(headerActions.setTitle({ title: 'Loading Run...' }))
      dispatch(
        headerActions.setSubtitle({
          subtitle: 'Data Collection In Progress',
        }),
      )
      break
    default:
      break
  }
}
