import React from 'react'
import { fontFamily } from '../style/font'
import { text } from '../style/color'

export default ({ size = 1, color = text, captilize, children }) => (
  <span
    style={{
      fontFamily,
      fontSize: `${size}rem`,
      color,
      textTransform: captilize ? 'uppercase' : undefined,
    }}
  >
    {children}
  </span>
)
