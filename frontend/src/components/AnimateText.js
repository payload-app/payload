import React from 'react'
import Typist from 'react-typist'
import 'react-typist/dist/Typist.css'

export const AnimateText = ({
  delay = 0,
  speed = 50,
  cursor = false,
  children,
  style,
}) => {
  return (
    <span style={style}>
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
    </span>
  )
}

export default AnimateText
