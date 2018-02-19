export const selector = 'Routing'
export const actionTypes = {
  EMIT: `${selector}/EMIT`,
}

export const actions = {
  emit: ({ route, params = {} }) => ({
    type: actionTypes.EMIT,
    route,
    params,
  }),
}
