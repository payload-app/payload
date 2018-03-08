import React from 'react'
import { Image, Text, Popover, Link, HR } from '../../../components'
import { text } from '../../../components/style/color'

const getAvatar = ({ user }) => user.accounts.github.avatar
const getName = ({ user }) => user.accounts.github.name
const getEmail = ({ user }) => user.email

export default ({ user }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
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
    <Popover>
      <div
        style={{
          border: `1px solid ${text}`,
          padding: '1rem',
        }}
      >
        <Text>{getEmail({ user })}</Text>
        <HR />
        <Link>Logout</Link>
      </div>
    </Popover>
  </div>
)
