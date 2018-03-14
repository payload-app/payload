import { push } from 'react-router-redux'
import {
  actions as dataFetchActions,
  actionTypes as dataFetchActionTypes,
} from '@hharnisc/async-data-fetch'
import {
  actionTypes as routingActionTypes,
  routes,
  generateListRoute,
  selector as routingSelector,
} from '../Routing'
import { actions, actionTypes, selector } from './reducer'
import { getValue, getItems } from './utils'

export default ({ dispatch, getState }) => next => action => {
  next(action)
  switch (action.type) {
    case routingActionTypes.EMIT:
      if ([routes.BASE, routes.REPO_LIST].includes(action.route)) {
        if (!getItems(getState()[selector]).length) {
          dispatch(
            dataFetchActions.fetch({
              name: 'repoOwners',
            }),
          )
        }
      }
      break
    case `repoOwners_${dataFetchActionTypes.FETCH_SUCCESS}`:
      const { [routingSelector]: { params, route } } = getState()
      const selection = action.result.findIndex(
        item =>
          route === routes.REPO_LIST &&
          item.name === params.owner &&
          item.type === params.type &&
          item.ownerType === params.ownerType,
      )
      dispatch(
        actions.addMenu({
          menu: action.result.map(item => {
            const { type, ownerType, name, id } = item
            return {
              display: name,
              key: id,
              url: generateListRoute({
                type,
                ownerType,
                owner: name,
              }),
            }
          }),
          selection,
        }),
      )
      if (selection === -1) {
        // this is will always be the first layer
        dispatch(actions.select({ selection: 0, layer: 0 }))
      }
      break
    case actionTypes.SELECT:
      const value = getValue(getState()[selector])
      if (value) {
        dispatch(push(value.url))
      }
      break
    default:
      break
  }
}
