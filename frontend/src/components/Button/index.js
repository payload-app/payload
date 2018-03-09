import React from 'react'
import { text, background as backgroundColor } from '../style/color'
import { calculateStyles } from '../utils/calculateStyles'
import { fontFamily } from '../style/font'

export default ({
  children,
  onClick,
  fontSize = 1.5,
  disabled,
  Icon,
  noStyle,
  fillContainer,
}) => (
  <button
    disabled={disabled}
    onClick={onClick}
    style={calculateStyles(
      {
        default: {
          cursor: 'pointer',
        },
        standard: {
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
        },
        noStyle: {
          background: 'none',
          color: 'inherit',
          border: 'none',
          padding: 0,
          font: 'inherit',
          outline: 'inherit',
          textAlign: 'inherit',
        },
        disabled: {
          cursor: 'not-allowed',
          opacity: 0.5,
        },
        fillContainer: {
          width: '100%',
        },
      },
      {
        standard: !noStyle,
        noStyle,
        disabled,
        fillContainer,
      },
    )}
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
