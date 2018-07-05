export const selector = 'Store'

export const actionTypes = {
  APP_INIT: `${selector}/APP_INIT`,
  APP_INIT_COMPLETE: `${selector}/APP_INIT_COMPLETE`,
}

const initialState = {
  initialized: false,
  initializing: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.APP_INIT:
      return {
        ...state,
        initializing: true,
      }
    case actionTypes.APP_INIT_COMPLETE:
      return {
        ...state,
        initializing: false,
        initialized: true,
      }
    default:
      return state
  }
}

export const actions = {
  appInit: () => ({
    type: actionTypes.APP_INIT,
  }),
  appInitComplete: () => ({
    type: actionTypes.APP_INIT_COMPLETE,
  }),
}
