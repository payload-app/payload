import { push } from 'react-router-redux'
import {
  actions as dataFetchActions,
  actionTypes as dataFetchActionTypes,
} from '@hharnisc/async-data-fetch'
import { actions, actionTypes } from './reducer'

const ownerUrlRegex = /^\/repos\/ownertype\/(\w+)\/ownerid\/(\w+)/

export default ({ dispatch, getState }) => next => action => {
  next(action)
  switch (action.type) {
    case 'APP_INIT':
      dispatch(
        dataFetchActions.fetch({
          name: 'repoOwners',
        }),
      )
      break
    case `repoOwners_${dataFetchActionTypes.FETCH_SUCCESS}`:
      if (action.result && action.result.length > 0) {
        const routerPath = getState().router.location.pathname
        const match = ownerUrlRegex.exec(routerPath)
        let owner = action.result[0]
        if (match) {
          const ownerType = match[1]
          const ownerId = match[2]
          owner = action.result.find(
            item => item.ownerType === ownerType && item.id === ownerId,
          )
        }
        dispatch(actions.setValue({ value: owner }))
      }
      break
    case actionTypes.SET_VALUE:
      dispatch(
        push(
          `/repos/ownertype/${action.value.ownerType}/ownerid/${
            action.value.id
          }/`,
        ),
      )
      break
    default:
      break
  }
}
