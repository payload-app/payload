import React from 'react'
import { text } from '../style/color'

export default ({
  children,
  color = text,
  height = 1.5,
  width = 1.5,
  viewBox = '0 0 16 16',
}) => (
  <svg
    style={{
      height: `${height}rem`,
      width: `${width}rem`,
    }}
    width="100%"
    height="100%"
    viewBox={viewBox}
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <g style={{ fill: color }}>{children}</g>
  </svg>
)
