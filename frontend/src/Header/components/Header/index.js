import React from 'react'
import { AnimateText, Pulse } from '../../../components'

export default ({ title, subtitle, warning }) => (
  <div>
    <div
      style={{
        height: '3.8rem',
        marginBottom: '1.4rem',
      }}
    >
      <AnimateText speed={30} delay={200} capitalize={true} size={3.8}>
        {title} {warning ? <Pulse>{warning}</Pulse> : ''}
      </AnimateText>
    </div>

    <div
      style={{
        height: '1.5rem',
        marginTop: '1rem',
        marginBottom: '1rem',
      }}
    >
      <AnimateText capitalize={true} cursor={true} antialiased={true}>
        {subtitle}
      </AnimateText>
    </div>
  </div>
)
