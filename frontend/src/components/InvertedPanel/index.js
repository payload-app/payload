import React from 'react'
import { invertedBackground } from '../style/color'

const InvertedPanel = ({ children, width, maxWidth, padding = 1 }) => (
  <div
    style={{
      background: invertedBackground,
      padding: `${padding}rem`,
      width: width ? `${width}rem` : undefined,
      maxWidth: maxWidth ? `${maxWidth}rem` : undefined,
    }}
  >
    {children}
  </div>
)

export default InvertedPanel
