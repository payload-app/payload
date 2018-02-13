export const selector = 'RepoSelector'

export const actionTypes = {
  ON_CHANGE: `${selector}/ON_CHANGE`,
}

const initialState = {
  value: undefined,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ON_CHANGE:
      return {
        ...state,
        value: action.value,
      }
    default:
      return state
  }
}

export const actions = {
  onChange: ({ value }) => ({
    type: actionTypes.ON_CHANGE,
    value,
  }),
}
