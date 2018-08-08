import React from 'react'

export default ({ src, height, width, circle }) => (
  <img
    style={{
      height,
      width,
      borderRadius: circle ? '50%' : undefined,
    }}
    src={src}
  />
)
