export const selector = 'Routing'
export const actionTypes = {
  EMIT: `${selector}/EMIT`,
  QUEUED_EMIT: `${selector}/QUEUED_EMIT`,
  FLUSH_EMIT_QUEUE: `${selector}/FLUSH_EMIT_QUEUE`,
}

const initialState = {
  route: null,
  params: {},
  queue: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.EMIT:
      return {
        ...state,
        route: action.route,
        params: action.params,
      }
    case actionTypes.QUEUED_EMIT:
      return {
        ...state,
        queue: [
          ...state.queue,
          {
            route: action.route,
            params: action.params,
            path: action.path,
            previousRoute: action.previousRoute,
            previousParams: action.previousParams,
            previousPath: action.previousPath,
          },
        ],
      }
    case actionTypes.FLUSH_EMIT_QUEUE:
      return {
        ...state,
        queue: [],
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
  queuedEmit: ({
    route,
    params = {},
    path,
    previousRoute,
    previousParams,
    previousPath,
  }) => ({
    type: actionTypes.QUEUED_EMIT,
    route,
    params,
    path,
    previousRoute,
    previousParams,
    previousPath,
  }),
  flushEmitQueue: () => ({
    type: actionTypes.FLUSH_EMIT_QUEUE,
  }),
}
