import { connect } from 'react-redux'
import Run from './components/Run'
import { selector } from './reducer'

export default connect(state => ({
  run: state[selector].run,
  loading: state[selector].loading,
}))(Run)

export { default as middleware } from './middleware'
export { default as reducer, selector } from './reducer'
