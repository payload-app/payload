// @flow
import { actionTypes } from './'

export const storeKey = 'layout'

type State = {
  headline: string,
  subhead: string,
  isLoading: boolean,
}

const initialState = {
  headline: '',
  subhead: '',
  isLoading: false,
}

export const reducer = (state: State = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.CHANGE_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      }
    case actionTypes.CHANGE_HEADER_TEXT:
      return {
        ...state,
        headline: action.headline,
        subhead: action.subhead,
      }
    default:
      return state
  }
}

export const selectors = {
  getLayoutInfo: ({ state }: Object) => state[storeKey],
}
