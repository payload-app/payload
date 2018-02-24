import React from 'react'
import { fontFamily } from '../style/font'
import { text } from '../style/color'

export default ({
  href = '#',
  onClick,
  size = 1.5,
  color = text,
  children,
  capitalize,
  weight = 400,
  antialiased = true,
}) => (
  <a
    style={{
      fontSize: `${size}rem`,
      fontFamily,
      color,
      textTransform: capitalize ? 'uppercase' : undefined,
      WebkitFontSmoothing: antialiased ? 'antialiased' : undefined,
      fontWeight: weight,
    }}
    href={href}
    onClick={onClick}
  >
    {children}
  </a>
)
