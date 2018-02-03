import React from 'react'
import Typist from 'react-typist'

export const AnimateText = ({
  delay = 0,
  speed = 50,
  cursor = false,
  children,
}) => {
  return (
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
  )
}

export default AnimateText
