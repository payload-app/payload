import { actionTypes as dataFetchActionTypes } from '@hharnisc/async-data-fetch'
export const selector = 'UserMenuItem'

export const actionTypes = {
  SETTINGS_CLICK: `${selector}/SETTINGS_CLICK`,
}

const initialState = {
  user: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case `getUser_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
        user: action.result,
      }
    default:
      return state
  }
}

export const actions = {
  settingsClick: () => ({
    type: actionTypes.SETTINGS_CLICK,
  }),
}
