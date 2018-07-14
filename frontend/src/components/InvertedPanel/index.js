import React from 'react'
import { invertedBackground } from '../style/color'

const InvertedPanel = ({ children }) => (
  <div style={{ background: invertedBackground, padding: '1rem' }}>
    {children}
  </div>
)

export default InvertedPanel
