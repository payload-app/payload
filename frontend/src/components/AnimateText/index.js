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
  captilize,
  children,
}) => (
  <Text size={size} color={color} captilize={captilize}>
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
