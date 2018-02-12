export const actionTypes = {
  SET_TITLE: 'SET_TITLE',
  SET_SUBTITLE: 'SET_SUBTITLE',
}

const initialState = {
  title: undefined,
  subtitle: undefined,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_TITLE:
      return {
        ...state,
        title: action.title,
      }
    case SET_SUBTITLE:
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
