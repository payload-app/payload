import React from 'react'
import {
  Image,
  Text,
  Link,
  HR,
  Button,
  PopoverContainer,
} from '../../../components'
import { text } from '../../../components/style/color'

const getAvatar = ({ user }) => user.accounts.github.avatar
const getName = ({ user }) => user.accounts.github.name
const getEmail = ({ user }) => user.email

const PopoverComponent = ({ user, onSettingsClick, onLogoutClick }) => (
  <div
    style={{
      border: `1px solid ${text}`,
      padding: '1rem',
    }}
  >
    <Text>{getEmail({ user })}</Text>
    <HR />
    <div>
      <Link
        onClick={e => {
          e.preventDefault()
          onSettingsClick()
        }}
      >
        Settings
      </Link>
    </div>
    <div>
      <Link
        onClick={e => {
          e.preventDefault()
          onLogoutClick()
        }}
      >
        Logout
      </Link>
    </div>
  </div>
)

const AnchorComponent = ({ user, onShowPopover }) => (
  <Button noStyle={true} fillContainer={true} onClick={onShowPopover}>
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
  </Button>
)

export default ({ user, onSettingsClick, onLogoutClick }) =>
  user ? (
    <PopoverContainer
      PopoverComponent={PopoverComponent}
      AnchorComponent={AnchorComponent}
      user={user}
      onSettingsClick={onSettingsClick}
      onLogoutClick={onLogoutClick}
    />
  ) : null
