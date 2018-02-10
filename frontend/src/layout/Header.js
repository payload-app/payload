import React from 'react'
import { connect } from 'react-redux'
import { selectors } from './'

import { AnimateText } from '../components'

export class Header extends React.Component {
  render() {
    const { layout } = this.props
    return (
      <div>
        <div
          style={{
            marginBottom: '0.5rem',
          }}
        >
          <AnimateText speed={30} delay={200} capitalize={true} size={2}>
            {layout.headline}
          </AnimateText>
        </div>
        <div
          style={{
            marginBottom: '0.5rem',
          }}
        >
          <AnimateText capitalize={true} cursor={true}>
            {layout.subhead}
          </AnimateText>
        </div>
      </div>
    )
  }
}

export default connect(state => ({
  layout: selectors.getLayoutInfo({ state }),
}))(Header)
