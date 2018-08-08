import React from 'react'
import injectStyle from '../utils/injectStyle'
import { red } from '../style/color'

export default ({
  backgroundColor = red,
  speed = 600,
  display = 'inline-block',
  children,
}) => {
  const keyframesStyle = `
    @keyframes pulse {
      0% { background-color: transparent }
      50% { background-color: ${backgroundColor} }
      100% { background-color: transparent }
    }
  `
  injectStyle(keyframesStyle)

  return (
    <span
      style={{ animation: `pulse ${speed}ms ease-in-out infinite`, display }}
    >
      {children}
    </span>
  )
}
