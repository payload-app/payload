export const selector = 'Header'

export const actionTypes = {
  SET_TITLE: `${selector}/SET_TITLE`,
  SET_SUBTITLE: `${selector}/SET_SUBTITLE`,
}

const initialState = {
  title: undefined,
  subtitle: undefined,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_TITLE:
      return {
        ...state,
        title: action.title,
      }
    case actionTypes.SET_SUBTITLE:
      return {
        ...state,
        subtitle: action.subtitle,
      }
    default:
      return state
  }
}

export const actions = {
  setTitle: ({ title }) => ({
    type: actionTypes.SET_TITLE,
    title,
  }),
  setSubtitle: ({ subtitle }) => ({
    type: actionTypes.SET_SUBTITLE,
    subtitle,
  }),
}
