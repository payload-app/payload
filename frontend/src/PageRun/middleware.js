import { actions as dataFetchActions } from '@hharnisc/async-data-fetch'
import { actionTypes as routingActionTypes, routes } from '../Routing'

export default ({ dispatch }) => next => action => {
  next(action)
  switch (action.type) {
    case routingActionTypes.EMIT:
      if (action.route === routes.RUNS) {
        dispatch(
          dataFetchActions.fetch({
            name: 'getRun',
            args: {
              type: action.params.type,
              owner: action.params.owner,
              ownerType: action.params.ownerType,
              repo: action.params.repo,
              sha: action.params.sha,
            },
          }),
        )
      }
      break
    default:
      break
  }
}
