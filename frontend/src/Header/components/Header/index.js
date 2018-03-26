import React, { Component } from 'react'
import { AnimateText, Pulse, Truncate } from '../../../components'
import LoadingBar from '../LoadingBar'

const StatelessFunctionalHeader = ({
  title,
  subtitle,
  warning,
  mounted,
  loading,
}) => (
  <div>
    <div
      style={{
        minHeight: '3.8rem',
        marginBottom: '1.4rem',
      }}
    >
      <AnimateText speed={30} delay={200} capitalize={true} size={3.8}>
        {title} {warning ? <Pulse>{warning}</Pulse> : ''}
      </AnimateText>
    </div>

    <LoadingBar mounted={mounted} loading={loading} />

    <div
      style={{
        height: '1.5rem',
        marginTop: '1rem',
        marginRight: '1rem',
        marginBottom: '1rem',
      }}
    >
      <Truncate>
        <AnimateText capitalize={true} cursor={true} antialiased={true}>
          {subtitle}
        </AnimateText>
      </Truncate>
    </div>
  </div>
)

export default class Header extends Component {
  state = {
    mounted: false,
  }
  componentDidMount() {
    this.setState({ mounted: true })
  }

  componentWillUnmount() {
    this.setState({ mounted: true })
  }

  render() {
    const props = {
      ...this.state,
      ...this.props,
    }
    return <StatelessFunctionalHeader {...props} />
  }
}
