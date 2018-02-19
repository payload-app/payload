import {
  actions as dataFetchActions,
  actionTypes as dataFetchActionTypes,
} from '@hharnisc/async-data-fetch'
import { actionTypes as routingActionTypes, routes } from '../Routing'
import { actions as headerActionTypes } from '../Header'

export default ({ dispatch }) => next => action => {
  next(action)
  switch (action.type) {
    case routingActionTypes.EMIT:
      if (action.route === routes.RUNS) {
        dispatch(
          dataFetchActions.fetch({
            name: 'getRun',
            args: {
              id: action.params.runId,
            },
          }),
        )
        dispatch(headerActionTypes.setTitle({ title: 'Loading Run...' }))
        dispatch(
          headerActionTypes.setSubtitle({
            subtitle: 'Data Collection In Progress',
          }),
        )
      }
      break
    case `getRun_${dataFetchActionTypes.FETCH_SUCCESS}`:
      const { owner, repo, branch, sha } = action.result
      dispatch(headerActionTypes.setTitle({ title: `${owner}/${repo}` }))
      dispatch(
        headerActionTypes.setSubtitle({ subtitle: `${branch} » ${sha}` }),
      )
    default:
      break
  }
}
