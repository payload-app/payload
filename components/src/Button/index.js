import React from 'react'
import { invertedText, invertedBackground } from '../style/color'
import calculateStyles from '../utils/calculateStyles'
import { fontFamily } from '../style/font'

export default ({
  children,
  onClick,
  fontSize = 1.5,
  disabled,
  Icon,
  noStyle,
  fillContainer,
  color,
  background,
  type,
}) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    style={calculateStyles(
      {
        default: {
          cursor: 'pointer',
        },
        standard: {
          background: invertedBackground,
          color: invertedText,
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
        color: {
          color,
        },
        background: {
          background,
        },
      },
      {
        standard: !noStyle,
        noStyle,
        disabled,
        fillContainer,
        color: !!color,
        background: !!background,
      },
    )}
  >
    {Icon ? (
      <Icon color={invertedText} height={fontSize} width={fontSize} />
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
