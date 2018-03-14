export const selector = 'Sidebar'

export const actionTypes = {
  ADD_MENU: `${selector}/ADD_MENU`,
  REMOVE_MENU: `${selector}/REMOVE_MENU`,
  SELECT: `${selector}/SELECT`,
}

// menus
// [[layer 1], [layer 2]]
// selections
// [0, 0]
const initialState = {
  menus: [],
  selections: [],
}

const selectionsReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_MENU:
      return [...state, action.selection]
    case actionTypes.SELECT:
      return state.map((selection, index) => {
        if (action.layer && action.layer === index) {
          return action.selection
        } else if (index === state.length - 1) {
          return action.selection
        } else {
          return selection
        }
      })
    default:
      return state
  }
}

const menusReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_MENU:
      return [...state, action.menu]
    default:
      return state
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_MENU:
      return {
        ...state,
        menus: menusReducer(state.menus, action),
        selections: selectionsReducer(state.selections, action),
      }
    case actionTypes.SELECT:
      return {
        ...state,
        selections: selectionsReducer(state.selections, action),
      }
    default:
      return state
  }
}

export const actions = {
  addMenu: ({ menu, selection = 0 }) => ({
    type: actionTypes.ADD_MENU,
    menu,
    selection,
  }),
  select: ({ selection, layer }) => ({
    type: actionTypes.SELECT,
    selection,
    layer,
  }),
}
