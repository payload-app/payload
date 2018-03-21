import { push } from 'react-router-redux'
import {
  actions as dataFetchActions,
  actionTypes as dataFetchActionTypes,
} from '@hharnisc/async-data-fetch'
import {
  actionTypes as routingActionTypes,
  routes,
  generateListRoute,
} from '../Routing'
import { selector, actions, actionTypes } from './reducer'

const updateMenu = ({ dispatch, menu, selection }) =>
  dispatch(
    actions.setMenu({
      menu,
      selection,
    }),
  )

const updateRepoOwnersMenu = ({ dispatch, getState, menu }) => {
  const { router: { location: { pathname } } } = getState()
  const selection = menu.findIndex(item => item.url === pathname)
  updateMenu({
    dispatch,
    menu,
  })
  dispatch(
    actions.select({
      selection: selection === -1 ? 0 : selection,
    }),
  )
}

export default ({ dispatch, getState }) => next => action => {
  next(action)
  switch (action.type) {
    case routingActionTypes.EMIT:
      switch (action.route) {
        case routes.BASE:
        case routes.REPO_LIST:
          const { repoOwners } = getState()[selector]
          if (!repoOwners.length) {
            dispatch(
              dataFetchActions.fetch({
                name: 'repoOwners',
              }),
            )
          } else {
            updateRepoOwnersMenu({
              dispatch,
              getState,
              menu: repoOwners.map(item => {
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
            })
          }
          dispatch(actions.toggleBackButton({ toggle: false }))
          break
        case routes.OWNER_SETTINGS:
          updateMenu({
            dispatch,
            menu: [
              {
                display: 'Sync Settings',
                key: 'syncSettings',
                url: action.path,
              },
            ],
          })
          dispatch(actions.select({ selection: 0 }))
          dispatch(actions.toggleBackButton({ toggle: true }))
          break
        case routes.RUNS:
          dispatch(actions.select({ selection: -1 }))
          updateMenu({
            dispatch,
            menu: [],
          })
          dispatch(actions.toggleBackButton({ toggle: true }))
        default:
          break
      }
      break
    case `repoOwners_${dataFetchActionTypes.FETCH_SUCCESS}`:
      updateRepoOwnersMenu({
        dispatch,
        getState,
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
      })
      break
    case actionTypes.SELECT:
      const state = getState()
      const value = state[selector].menu[action.selection]
      const { router: { location: { pathname } } } = state
      if (value && value.url !== pathname) {
        dispatch(push(value.url))
      }
      break
    default:
      break
  }
}
