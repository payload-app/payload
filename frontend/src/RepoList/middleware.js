import { actions as dataFetchActions } from '@hharnisc/async-data-fetch'
import { actionTypes as sidebarActionTypes, selector } from '../Sidebar'

export default ({ dispatch, getState }) => next => action => {
  next(action)
  switch (action.type) {
    case sidebarActionTypes.SELECT:
      const { repoOwners } = getState()[selector]
      dispatch(
        dataFetchActions.fetch({
          name: 'repos',
          args: {
            name: repoOwners[action.selection].name,
            ownerType: repoOwners[action.selection].ownerType,
          },
        }),
      )
      break
    default:
      break
  }
}
