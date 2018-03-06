import React from 'react'
import { Image, Text } from '../../../components'

const getAvatar = ({ user }) => user.accounts.github.avatar
const getName = ({ user }) => user.accounts.github.name

export default ({ user }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
    }}
  >
    <div style={{ flexGrow: 1 }}>
      <Text weight={400}>{getName({ user })}</Text>
    </div>
    <Image
      height={'4rem'}
      width={'4rem'}
      circle={true}
      src={getAvatar({ user })}
    />
  </div>
)
