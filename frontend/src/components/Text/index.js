import React from 'react'
import { fontFamily } from '../style/font'

export default ({ size = 1, color = '#333333', children }) => (
  <span style={{ fontFamily, fontSize: `${size}rem`, color }}>{children}</span>
)
