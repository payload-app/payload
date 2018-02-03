import React from 'react'
import { connect } from 'react-redux'
import { actions } from './'

export class Page extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: props.fetch ? true : false,
      done: props.fetch ? false : true,
      error: false,
    }
  }
  componentDidMount() {
    const {
      onChangeHeaderText,
      onLoading,
      onLoadingComplete,
      headline,
      subhead,
      fetch,
    } = this.props
    onChangeHeaderText({ headline, subhead })
    onLoading()

    const done = () => {
      this.setState({ loading: false, done: true })
      onLoadingComplete()
    }
    const error = (error = {}) => {
      this.setState({ loading: false, error })
      onLoadingComplete()
    }
    fetch && fetch({ done, error })
  }

  render() {
    const { children } = this.props
    const { loading, done, error } = this.state

    return children({
      loading,
      done,
      error,
    })
  }
}

export default connect(() => ({}), {
  onChangeHeaderText: actions.changeHeaderText,
  onLoading: actions.loading,
  onLoadingComplete: actions.loadingComplete,
})(Page)
