import { connect } from 'react-redux'
import Sidebar from './components/Sidebar'
import { selector, actions } from './reducer'

export default connect(
  state => ({
    items: state[selector].menu,
    value: state[selector].menu[state[selector].selection],
    showBackButton: state[selector].showBackButton,
  }),
  dispatch => ({
    onChange: ({ index }) => {
      dispatch(actions.select({ selection: index }))
    },
    onBackClick: e => {
      e.preventDefault()
      dispatch(actions.backButtonClick())
    },
  }),
)(Sidebar)
export { default as reducer, selector, actions, actionTypes } from './reducer'
export { default as middleware } from './middleware'
