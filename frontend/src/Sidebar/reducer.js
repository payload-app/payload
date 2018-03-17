import { actionTypes as dataFetchActionTypes } from '@hharnisc/async-data-fetch'
export const selector = 'Sidebar'

export const actionTypes = {
  SET_MENU: `${selector}/SET_MENU`,
  SELECT: `${selector}/SELECT`,
  SET_BACKURL: `${selector}/SET_BACKURL`,
  CLEAR_BACKURL: `${selector}/CLEAR_BACKURL`,
}

const initialState = {
  repoOwners: [],
  menu: [],
  selection: -1,
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
    case actionTypes.SET_BACKURL:
      return {
        ...state,
        backUrl: action.url,
      }
    case actionTypes.CLEAR_BACKURL:
      return {
        ...state,
        backUrl: undefined,
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
  setBackUrl: ({ url }) => ({
    type: actionTypes.SET_BACKURL,
    url,
  }),
  clearBackUrl: () => ({
    type: actionTypes.CLEAR_BACKURL,
  }),
}
