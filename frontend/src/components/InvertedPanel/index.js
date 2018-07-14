import React from 'react'
import { invertedBackground } from '../style/color'

const InvertedPanel = ({ children, width, padding = 1 }) => (
  <div
    style={{
      background: invertedBackground,
      padding: `${padding}rem`,
      width: width ? `${width}rem` : undefined,
    }}
  >
    {children}
  </div>
)

export default InvertedPanel
