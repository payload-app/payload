import React from 'react'
import { AnimateText } from '../../../components'

const Subtitle = ({ subtitle }) => (
  <div
    style={{
      height: '1rem',
      marginBottom: '0.5rem',
    }}
  >
    <AnimateText capitalize={true} cursor={true}>
      {subtitle}
    </AnimateText>
  </div>
)

export default ({ title, subtitle }) => (
  <div>
    <div
      style={{
        height: '2rem',
        marginBottom: '0.5rem',
      }}
    >
      <AnimateText speed={30} delay={200} capitalize={true} size={2}>
        {title}
      </AnimateText>
    </div>
    {subtitle ? <Subtitle subtitle={subtitle} /> : null}
  </div>
)
