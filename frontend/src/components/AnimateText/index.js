import React from 'react'
import Typist from 'react-typist'
import 'react-typist/dist/Typist.css'
import Text from '../Text'

export default ({
  delay = 0,
  speed = 50,
  cursor = false,
  size,
  color,
  capitalize,
  children,
}) => (
  <Text size={size} color={color} capitalize={capitalize}>
    <Typist
      startDelay={delay}
      stdTypingDelay={0}
      avgTypingDelay={speed}
      cursor={{
        show: cursor,
      }}
      key={children}
    >
      {children}
    </Typist>
  </Text>
)
