import { actions as dataFetchActions } from '@hharnisc/async-data-fetch'
import { actionTypes as repoSelectorActionTypes } from '../RepoSelector'

export default ({ dispatch }) => next => action => {
  next(action)
  switch (action.type) {
    case repoSelectorActionTypes.SET_VALUE:
      dispatch(
        dataFetchActions.fetch({
          name: 'repos',
          args: {
            name: action.value.name,
            ownerType: action.value.ownerType,
          },
        }),
      )
      break
    default:
      break
  }
}
