export const selector = 'PageInvited'

export const actionTypes = {
  FETCH_START: `${selector}/FETCH_START`,
  FETCH_SUCCESS: `${selector}/FETCH_SUCCESS`,
  FETCH_FAIL: `${selector}/FETCH_FAIL`,
}

const initialState = {
  loading: true,
  error: null,
  invitesBefore: null,
  invitesAfter: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_START:
      return {
        ...state,
        loading: true,
      }
    case actionTypes.FETCH_SUCCESS:
      return {
        ...state,
        invitesBefore: action.result.before,
        invitesAfter: action.result.after,
        loading: false,
      }
    case actionTypes.FETCH_FAIL:
      return {
        ...state,
        error: action.error,
        loading: false,
      }
    default:
      return state
  }
}

export const actions = {
  fetchStart: () => ({
    type: actionTypes.FETCH_START,
  }),
  fetchSuccess: ({ result }) => ({
    type: actionTypes.FETCH_SUCCESS,
    result,
  }),
  fetchFail: ({ error }) => ({
    type: actionTypes.FETCH_FAIL,
    error,
  }),
}
