import React from 'react'
import { text, background as backgroundColor } from '../style/color'
import { fontFamily } from '../style/font'

export default ({ children, onClick, fontSize = 1.5, disabled }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    style={{
      background: text,
      color: backgroundColor,
      fontSize: `${fontSize}rem`,
      fontFamily,
      fontWeight: 400,
      textTransform: 'uppercase',
      outline: 'none',
      border: 'none',
      paddingTop: 1,
      paddingBottom: 2,
      paddingLeft: 3,
      paddingRight: 3,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : undefined,
    }}
  >
    {children}
  </button>
)
