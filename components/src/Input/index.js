import React from 'react'
import calculateStyles from '../utils/calculateStyles'
import { fontFamily } from '../style/font'
import { mutedWhite, background, text } from '../style/color'
import './style.css'

const Input = ({
  value,
  name,
  color,
  background: backgroundColor,
  placeholder,
  disabled,
  focused,
  type = 'text',
  fontSize = 1.5,
  fillContainer = true,
  onChange,
  onFocus,
  onBlur,
}) => (
  <input
    className={'Input'}
    style={calculateStyles(
      {
        default: {
          fontSize: `${fontSize}rem`,
          fontFamily,
          background: mutedWhite,
          color: text,
          boxSizing: 'border-box',
          fontWeight: 200,
          padding: `${fontSize / 3}rem ${fontSize / 2}rem`,
          border: '0.25rem solid',
          borderColor: background,
          transition: 'all 0.6s',
          outline: 0,
        },
        color: {
          color,
        },
        background: {
          background: backgroundColor,
        },
        disabled: {
          opacity: 0.6,
        },
        fillContainer: {
          width: '100%',
        },
        focused: {
          borderColor: text,
        },
      },
      {
        color: !!color,
        background: !!backgroundColor,
        fillContainer,
        disabled,
        focused,
      },
    )}
    type={type}
    value={value}
    name={name}
    placeholder={placeholder}
    onChange={onChange}
    disabled={disabled}
    onFocus={onFocus}
    onBlur={onBlur}
  />
)

export default Input
