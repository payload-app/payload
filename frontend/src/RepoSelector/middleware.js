import { push } from 'react-router-redux'
import {
  actions as dataFetchActions,
  actionTypes as dataFetchActionTypes,
} from '@hharnisc/async-data-fetch'
import { actions, actionTypes, selector } from './reducer'
import {
  getListRouteParams,
  generateListRoute,
  actionTypes as routingActionTypes,
  routes,
} from '../Routing'

export default ({ dispatch, getState }) => next => action => {
  next(action)
  switch (action.type) {
    case routingActionTypes.EMIT:
      if ([routes.BASE, routes.REPO_LIST].includes(action.route)) {
        dispatch(
          dataFetchActions.fetch({
            name: 'repoOwners',
          }),
        )
      }
      break
    case `repoOwners_${dataFetchActionTypes.FETCH_SUCCESS}`:
      if (action.result && action.result.length > 0) {
        const {
          router: { location: { pathname: path } },
          [selector]: { value: curValue },
        } = getState()
        const match = getListRouteParams({ path })
        let newValue = action.result[0]
        if (match) {
          const { ownerType, ownerId } = match
          newValue = action.result.find(
            item => item.ownerType === ownerType && item.id === ownerId,
          )
        }
        if (JSON.stringify(newValue) !== JSON.stringify(curValue)) {
          dispatch(actions.setValue({ value: newValue }))
        }
      }
      break
    case actionTypes.SET_VALUE:
      const { ownerType, id: ownerId } = action.value
      dispatch(
        push(
          generateListRoute({
            ownerType,
            ownerId,
          }),
        ),
      )
      break
    default:
      break
  }
}
