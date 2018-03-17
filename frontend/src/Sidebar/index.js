import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import Sidebar from './components/Sidebar'
import { selector, actions } from './reducer'

export default connect(
  state => ({
    items: state[selector].menu,
    value: state[selector].menu[state[selector].selection],
    backUrl: state[selector].backUrl,
  }),
  dispatch => ({
    onChange: ({ index }) => {
      dispatch(actions.select({ selection: index }))
    },
    onBackClick: ({ event, url }) => {
      event.preventDefault()
      console.log('url', url)
      dispatch(push(url))
    },
  }),
)(Sidebar)
export { default as reducer, selector, actions, actionTypes } from './reducer'
export { default as middleware } from './middleware'
