export const selector = 'Routing'
export const actionTypes = {
  EMIT: `${selector}/EMIT`,
}

const initialState = {
  route: null,
  params: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.EMIT:
      return {
        ...state,
        route: action.route,
        params: action.params,
      }
    default:
      return state
  }
}

export const actions = {
  emit: ({
    route,
    params = {},
    path,
    previousRoute,
    previousParams,
    previousPath,
  }) => ({
    type: actionTypes.EMIT,
    route,
    params,
    path,
    previousRoute,
    previousParams,
    previousPath,
  }),
}
