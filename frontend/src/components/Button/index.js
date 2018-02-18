import React from 'react'
import { text, background as backgroundColor } from '../style/color'
import { fontFamily } from '../style/font'

export default ({ children, onClick, fontSize = 1, disabled }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    style={{
      background: text,
      color: backgroundColor,
      fontSize: `${fontSize}rem`,
      fontFamily,
      fontWeight: 600,
      textTransform: 'uppercase',
      outline: 'none',
      border: '1px solid transparent',
      // HACK: attempt to put text in middle
      paddingBottom: `${0.15 * fontSize}rem`,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : undefined,
    }}
  >
    {children}
  </button>
)
