import React from 'react'
import { fontFamily } from '../style/font'
import { text } from '../style/color'

export default ({
  size = 1.5,
  color = text,
  background,
  capitalize,
  children,
  weight = 200,
  antialiased,
}) => (
  <span
    style={{
      fontFamily,
      fontSize: `${size}rem`,
      color,
      background,
      fontWeight: weight,
      textTransform: capitalize ? 'uppercase' : undefined,
      WebkitFontSmoothing: antialiased ? 'antialiased' : undefined,
    }}
  >
    {children}
  </span>
)
