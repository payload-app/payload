import { connect } from 'react-redux'
import Sidebar from './components/Sidebar'
import { selector, actions } from './reducer'
import { getItems, getValue } from './utils'

export default connect(
  state => ({
    items: getItems(state[selector]),
    value: getValue(state[selector]),
    layer: state[selector].length - 1,
  }),
  dispatch => ({
    onChange: ({ index, layer }) => {
      dispatch(actions.select({ selection: index, layer }))
    },
  }),
)(Sidebar)
export { default as reducer, selector, actions, actionTypes } from './reducer'
export { default as middleware } from './middleware'
