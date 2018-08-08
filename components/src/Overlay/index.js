import React from 'react'
import { background as backgroundColor } from '../style/color'
import { overlay } from '../style/zIndex'

export default ({ onClick, background = backgroundColor, opacity = 0.5 }) => (
  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
  <div
    onClick={onClick}
    style={{
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background,
      zIndex: overlay,
      opacity,
    }}
  />
)
