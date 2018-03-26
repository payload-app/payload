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
      switch (action.route) {
        case routes.REPO_LIST:
          if (getState()[repoListSelector].repos.length) {
            setSubtitleTrackingCount({
              dispatch,
              getState,
            })
          } else {
            dispatch(headerActions.setTitle({ title: 'Payload Dashboard' }))
            dispatch(headerActions.setSubtitle({ subtitle: 'Loading...' }))
          }
          break
        case routes.AUTH:
          dispatch(headerActions.setTitle({ title: 'Authentication' }))
          dispatch(headerActions.setWarning({ warning: 'Required' }))
          dispatch(
            headerActions.setSubtitle({ subtitle: 'Locating Source Code...' }),
          )
          dispatch(headerActions.setLoading({ loading: true }))
          setTimeout(() => {
            dispatch(headerActions.setLoading({ loading: false }))
          }, 4000)
          break
        case routes.INIT:
        case routes.BASE:
          dispatch(headerActions.setTitle({ title: 'Payload Dashboard' }))
          dispatch(headerActions.setSubtitle({ subtitle: 'Loading...' }))
          break
        case routes.OWNER_SETTINGS:
          if (action.params.settingsType === 'sync') {
            dispatch(headerActions.setTitle({ title: 'Sync Settings' }))
            dispatch(
              headerActions.setSubtitle({
                subtitle: 'Configuring Telemetry...',
              }),
            )
          }
        default:
          break
      }
      break
    case `repos_${dataFetchActionTypes.FETCH_START}`:
      dispatch(headerActions.setSubtitle({ subtitle: 'Loading...' }))
      dispatch(headerActions.setLoading({ loading: true }))
      break
    case `activateRepo_${dataFetchActionTypes.FETCH_SUCCESS}`:
    case `activateRepo_${dataFetchActionTypes.FETCH_FAIL}`:
    case `repos_${dataFetchActionTypes.FETCH_SUCCESS}`:
      setSubtitleTrackingCount({
        dispatch,
        getState,
      })
      dispatch(headerActions.setLoading({ loading: false }))
      break
    case `activateRepo_${dataFetchActionTypes.FETCH_START}`:
      dispatch(
        headerActions.setSubtitle({ subtitle: 'Activating Repository...' }),
      )
      dispatch(headerActions.setLoading({ loading: true }))
      break
    case `getRun_${dataFetchActionTypes.FETCH_SUCCESS}`:
      const { owner, repo, branch, sha } = action.result
      dispatch(headerActions.setTitle({ title: `${owner}/${repo}` }))
      dispatch(headerActions.setSubtitle({ subtitle: `${branch} » ${sha}` }))
      dispatch(headerActions.setLoading({ loading: false }))
      break
    case `getRun_${dataFetchActionTypes.FETCH_START}`:
      dispatch(headerActions.setTitle({ title: 'Loading Run...' }))
      dispatch(
        headerActions.setSubtitle({
          subtitle: 'Data Collection In Progress',
        }),
      )
      dispatch(headerActions.setLoading({ loading: true }))
      break
    case `getRun_${dataFetchActionTypes.FETCH_FAIL}`:
      dispatch(headerActions.setTitle({ title: 'Loading' }))
      dispatch(headerActions.setWarning({ warning: 'Failed' }))
      dispatch(
        headerActions.setSubtitle({
          subtitle: 'Please try again later',
        }),
      )
      dispatch(headerActions.setLoading({ loading: false }))
      break
    case `syncRepos_${dataFetchActionTypes.FETCH_START}`:
      dispatch(headerActions.setTitle({ title: 'Syncing Repositories' }))
      dispatch(
        headerActions.setSubtitle({
          subtitle: 'Data Collection In Progress...',
        }),
      )
      dispatch(headerActions.setLoading({ loading: true }))
      break
    case `syncRepos_${dataFetchActionTypes.FETCH_SUCCESS}`:
      dispatch(
        headerActions.setTitle({ title: 'Syncing Repositories Complete' }),
      )
      dispatch(
        headerActions.setSubtitle({
          subtitle: 'Data Collection Complete',
        }),
      )
      dispatch(headerActions.setLoading({ loading: false }))
      break
    case `syncRepos_${dataFetchActionTypes.FETCH_FAIL}`:
      dispatch(headerActions.setTitle({ title: 'Syncing Repositories' }))
      dispatch(headerActions.setWarning({ warning: 'Failed' }))
      dispatch(
        headerActions.setSubtitle({
          subtitle: 'Data Collection Failed',
        }),
      )
      dispatch(headerActions.setLoading({ loading: false }))
      break
    case `syncOrganizations_${dataFetchActionTypes.FETCH_START}`:
      dispatch(headerActions.setTitle({ title: 'Syncing Organizations' }))
      dispatch(
        headerActions.setSubtitle({
          subtitle: 'Data Collection In Progress...',
        }),
      )
      dispatch(headerActions.setLoading({ loading: true }))
      break
    case `syncOrganizations_${dataFetchActionTypes.FETCH_SUCCESS}`:
      dispatch(
        headerActions.setTitle({ title: 'Syncing Organizations Complete' }),
      )
      dispatch(
        headerActions.setSubtitle({
          subtitle: 'Data Collection Complete',
        }),
      )
      dispatch(headerActions.setLoading({ loading: false }))
      break
    case `syncOrganizations_${dataFetchActionTypes.FETCH_FAIL}`:
      dispatch(headerActions.setTitle({ title: 'Syncing Organizations' }))
      dispatch(headerActions.setWarning({ warning: 'Failed' }))
      dispatch(
        headerActions.setSubtitle({
          subtitle: 'Data Collection Failed',
        }),
      )
      dispatch(headerActions.setLoading({ loading: false }))
      break
    default:
      break
  }
}
