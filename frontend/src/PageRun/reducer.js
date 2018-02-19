import { actionTypes as dataFetchActionTypes } from '@hharnisc/async-data-fetch'

export const selector = 'PageRun'

const initialState = {
  run: {},
  loading: true,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case `getRun_${dataFetchActionTypes.FETCH_START}`:
      return {
        ...state,
        loading: true,
      }
    case `getRun_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
        run: {
          ...action.result,
        },
        loading: false,
      }
    default:
      return state
  }
}
