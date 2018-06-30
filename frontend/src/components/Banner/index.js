import React from 'react'
import Text from '../Text'
import { invertedBackground, invertedText } from '../style/color'

const Banner = ({ children }) => (
  <div style={{ background: invertedBackground, padding: '1rem' }}>
    <Text size={2} color={invertedText}>
      {children}
    </Text>
  </div>
)

export default Banner
