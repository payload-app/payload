import React from 'react'
import { text } from '../style/color'

export default ({ children, color = text }) => (
  <div
    style={{
      color,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </div>
)
