import React from 'react'
import { Text } from '../../../components'
import { white, mutedWhite } from '../../../components/style/color'

export default ({ children, active, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: active ? 10 : 13,
        borderLeftWidth: active ? 4 : 1,
        borderLeftStyle: 'solid',
        borderLeftColor: active ? white : mutedWhite,
      }}
    >
      <Text capitalize color={active ? white : mutedWhite}>
        {children}
      </Text>
    </div>
  )
}
