import React from 'react'

export default class extends React.Component {
  state = {
    mounted: false,
    loading: false,
  }
  componentDidMount() {
    this.setState({ mounted: true, loading: true })

    setTimeout(() => {
      this.setState({ loading: false })
    }, 4000)
  }
  render() {
    const renderProp = this.props.render || this.props.children
    return renderProp(this.state)
  }
}
