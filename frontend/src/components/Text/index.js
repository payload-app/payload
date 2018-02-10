import React from 'react'
import { fontFamily } from '../style/font'

export default ({ size = 1, children }) => (
  <span style={{ fontFamily, fontSize: `${size}rem` }}>{children}</span>
)
