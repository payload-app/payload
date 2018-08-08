import React from 'react'
import prettyBytes from 'pretty-bytes'

import { Text, AnimateText } from '@payloadapp/components'

const SplitFileSize = ({ size }) => {
  const [smallSize, sizeLabel] = prettyBytes(size).split(' ')

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <AnimateText delay={1000} speed={80} size={2} weight={400}>
        {smallSize}
      </AnimateText>

      <span style={{ marginLeft: 4, marginBottom: 2 }}>
        <Text size={1} capitalize={true}>
          {sizeLabel}
        </Text>
      </span>
    </div>
  )
}

export default SplitFileSize
