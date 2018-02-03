export const actionTypes = {
  CHANGE_HEADER_TEXT: 'LAYOUT/CHANGE_HEADER_TEXT',
  CHANGE_LOADING: 'LAYOUT/CHANGE_LOADING',
}

export const actions = {
  changeHeaderText: ({ headline, subhead }) => ({
    type: actionTypes.CHANGE_HEADER_TEXT,
    headline,
    subhead,
  }),
  loading: () => ({ type: actionTypes.CHANGE_LOADING, isLoading: true }),
  loadingComplete: () => ({
    type: actionTypes.CHANGE_LOADING,
    isLoading: false,
  }),
}
