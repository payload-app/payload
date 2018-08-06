import React, { Component } from 'react'
import AnimateText from '../AnimateText'
import Pulse from '../Pulse'
import Truncate from '../Truncate'
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
        minHeight: '4.6rem',
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

// HACK: only run on first load
let mounted = false

export default class Header extends Component {
  state = {
    mounted: false,
  }
  componentDidMount() {
    this.setState({ mounted: true })
    mounted = true
  }

  render() {
    return <StatelessFunctionalHeader {...this.props} mounted={mounted} />
  }
}
