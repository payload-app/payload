import React from 'react'
import { calculateStyles } from '../utils/calculateStyles'
import Text from '../Text'
import {
  invertedBackground,
  invertedText,
  brightRed,
  text,
} from '../style/color'

const Banner = ({ type, children }) => (
  <div
    style={calculateStyles(
      {
        default: { background: invertedBackground, padding: '1rem' },
        error: {
          background: brightRed,
        },
      },
      {
        error: type === 'error',
      },
    )}
  >
    <Text size={2} color={type === 'error' ? text : invertedText}>
      {children}
    </Text>
  </div>
)

export default Banner
