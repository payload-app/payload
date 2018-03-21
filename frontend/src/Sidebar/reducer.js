import { actionTypes as dataFetchActionTypes } from '@hharnisc/async-data-fetch'
export const selector = 'Sidebar'

export const actionTypes = {
  SET_MENU: `${selector}/SET_MENU`,
  SELECT: `${selector}/SELECT`,
  TOGGLE_BACK_BUTTON: `${selector}/TOGGLE_BACK_BUTTON`,
}

const initialState = {
  repoOwners: [],
  menu: [],
  selection: -1,
  showBackButton: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_MENU:
      return {
        ...state,
        menu: action.menu,
      }
    case actionTypes.SELECT:
      return {
        ...state,
        selection: action.selection,
      }
    case actionTypes.TOGGLE_BACK_BUTTON:
      return {
        ...state,
        showBackButton: action.toggle,
      }
    case `repoOwners_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
        repoOwners: action.result,
      }
    default:
      return state
  }
}

export const actions = {
  setMenu: ({ menu }) => ({
    type: actionTypes.SET_MENU,
    menu,
  }),
  select: ({ selection }) => ({
    type: actionTypes.SELECT,
    selection,
  }),
  toggleBackButton: ({ toggle }) => ({
    type: actionTypes.TOGGLE_BACK_BUTTON,
    toggle,
  }),
}
