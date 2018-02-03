import React from 'react'
import { connect } from 'react-redux'
import { selectors } from './'

import { AnimateText } from '../components'

export class Header extends React.Component {
  render() {
    const { layout } = this.props
    return (
      <div>
        <AnimateText>{layout.headline}</AnimateText>
        <AnimateText>{layout.subhead}</AnimateText>
      </div>
    )
  }
}

export default connect(state => ({
  layout: selectors.getLayoutInfo({ state }),
}))(Header)
