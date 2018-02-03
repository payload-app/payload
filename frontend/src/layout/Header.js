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
            height: 46,
            display: 'block',
            textTransform: 'uppercase',
          }}
        >
          {layout.headline}
        </AnimateText>
        <AnimateText
          style={{
            fontSize: 15,
            textTransform: 'uppercase',
          }}
          cursor={true}
        >
          {layout.subhead}
        </AnimateText>
      </div>
    )
  }
}

export default connect(state => ({
  layout: selectors.getLayoutInfo({ state }),
}))(Header)
