export const selector = 'Header'

export const actionTypes = {
  SET_TITLE: `${selector}/SET_TITLE`,
  SET_SUBTITLE: `${selector}/SET_SUBTITLE`,
  SET_WARNING: `${selector}/SET_WARNING`,
  SET_LOADING: `${selector}/SET_LOADING`,
}

const initialState = {
  title: '',
  subtitle: '',
  warning: '',
  loading: false,
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
    case actionTypes.SET_WARNING:
      return {
        ...state,
        warning: action.warning,
      }
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.loading,
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
  setWarning: ({ warning }) => ({
    type: actionTypes.SET_WARNING,
    warning,
  }),
  setLoading: ({ loading }) => ({
    type: actionTypes.SET_LOADING,
    loading,
  }),
}
