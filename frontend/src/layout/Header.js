import React from 'react'
import { connect } from 'react-redux'
import { selectors } from './'

import { AnimateText } from '../components'

export class Header extends React.Component {
  render() {
    const { layout } = this.props
    return (
      <div>
        <AnimateText
          speed={30}
          delay={200}
          style={{
            fontSize: 38,
            height: 50,
          }}
        >
          {layout.headline}
        </AnimateText>
        <AnimateText style={{ fontSize: 15 }} cursor={true}>
          {layout.subhead}
        </AnimateText>
      </div>
    )
  }
}

export default connect(state => ({
  layout: selectors.getLayoutInfo({ state }),
}))(Header)
