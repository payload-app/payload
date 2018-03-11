import React from 'react'
import { Text } from '../../../components'
import { white, mutedWhite } from '../../../components/style/color'

export default ({ name, active, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        padding: 10,
      }}
    >
      <Text capitalize color={active ? white : mutedWhite}>
        {name}
      </Text>
    </div>
  )
}
