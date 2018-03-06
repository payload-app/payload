import React from 'react'
import { background, text } from '../style/color'

export default ({ children, width }) => (
  <div
    style={{
      width,
      color: text,
      background,
      border: `0.25rem solid ${text}`,
      padding: '1rem',
    }}
  >
    {children}
  </div>
)
