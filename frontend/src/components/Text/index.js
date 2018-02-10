import React from 'react'
import { fontFamily } from '../style/font'
import { text } from '../style/color'

export default ({ size = 1, color = text, children }) => (
  <span style={{ fontFamily, fontSize: `${size}rem`, color }}>{children}</span>
)
