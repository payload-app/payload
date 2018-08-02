import React from 'react'

import { Text, style } from '@payloadapp/components'
const { color: { white, mutedWhite, brightRed } } = style

const SizeChangePercent = ({ size, prevSize }) => {
  const change = (size - prevSize) / prevSize * 100
  const increased = change > 0

  const symbol = increased ? '↗' : change < 0 ? '↘' : '-'

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Text
        size={2.4}
        color={increased ? brightRed : white}
        weight={increased ? 600 : 400}
      >
        {symbol}
      </Text>
      <Text size={1} color={mutedWhite} weight={400}>
        {`${change.toFixed(2)}%`}
      </Text>
    </div>
  )
}

export default SizeChangePercent
