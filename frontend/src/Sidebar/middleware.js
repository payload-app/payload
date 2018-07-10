import { push } from 'react-router-redux'
import {
  actionTypes as routingActionTypes,
  routes,
  generateListRoute,
  generateOwnerSettingsRoute,
} from '../Routing'
import { selector, actions, actionTypes } from './reducer'

const updateMenu = ({ dispatch, getState, menu, selection }) => {
  const { [selector]: { selection: currentSelection } } = getState()
  dispatch(
    actions.setMenu({
      menu,
    }),
  )

  if (selection !== undefined && currentSelection !== selection) {
    dispatch(
      actions.select({
        selection,
      }),
    )
  }
}

export default ({ dispatch, getState }) => next => action => {
  next(action)
  switch (action.type) {
    case routingActionTypes.EMIT:
      switch (action.route) {
        case routes.BASE:
        case routes.REPO_LIST: {
          const {
            [selector]: { repoOwners },
            router: { location: { pathname } },
          } = getState()
          const menu = repoOwners.map(item => {
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
          })
          const selection =
            action.route === routes.BASE
              ? 0
              : menu.findIndex(item => item.url === pathname)
          updateMenu({
            dispatch,
            getState,
            menu,
            selection,
          })
          dispatch(actions.toggleBackButton({ toggle: false }))
          break
        }
        case routes.OWNER_SETTINGS:
          const { router: { location: { pathname } } } = getState()
          const { type, ownerType, owner } = action.params
          const menu = [
            {
              display: 'Sync Settings',
              key: 'syncSettings',
              url: generateOwnerSettingsRoute({
                type,
                ownerType,
                owner,
                settingsType: 'sync',
              }),
            },
            {
              display: 'Billing',
              key: 'billing',
              url: generateOwnerSettingsRoute({
                type,
                ownerType,
                owner,
                settingsType: 'billing',
              }),
            },
          ]
          updateMenu({
            dispatch,
            getState,
            menu,
            selection: menu.findIndex(item => item.url === pathname),
          })
          dispatch(actions.toggleBackButton({ toggle: true }))
          break
        case routes.RUNS:
          updateMenu({
            dispatch,
            getState,
            menu: [],
            selection: -1,
          })
          dispatch(actions.toggleBackButton({ toggle: true }))
        default:
          break
      }
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
