import { actionTypes, actions } from './actions'

export const middleware = ({ dispatch }) => next => action => {
  next(action)
  switch (action.type) {
    case actionTypes.FETCH_REPOS:
      dispatch(actions.fetchSavedRepos())
      dispatch(actions.fetchGithubRepos({ token: action.token }))
    default:
      break
  }
}
