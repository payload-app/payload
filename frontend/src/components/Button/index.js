import React from 'react'
import { text, background as backgroundColor } from '../style/color'
import { fontFamily } from '../style/font'

export default ({ children, onClick, fontSize = 1.5, disabled, Icon }) => (
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
      display: 'inline-flex',
      alignItems: 'center',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : undefined,
    }}
  >
    {Icon ? (
      <Icon color={backgroundColor} height={fontSize} width={fontSize} />
    ) : null}
    <span
      style={{
        marginLeft: Icon ? `${fontSize / 4}rem` : 0,
      }}
    >
      {children}
    </span>
  </button>
)
