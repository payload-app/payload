import React from 'react'
import {
  Image,
  Text,
  Link,
  HR,
  Button,
  PopoverContainer,
} from '../../../components'
import { text, mutedWhite } from '../../../components/style/color'

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
          onSettingsClick({ user })
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
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          borderTop: `1px solid ${mutedWhite}`,
          borderRight: `1px solid ${mutedWhite}`,
          borderLeft: `1px solid ${mutedWhite}`,
          height: 10,
        }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          opacity: 0.5,
          paddingLeft: 10,
          paddingRight: 10,
          paddingBottom: 10,
        }}
      >
        <div style={{ flexGrow: 1 }}>
          <Text weight={400} capitalize>
            {getName({ user })}
          </Text>
        </div>
        <Image
          height={'2rem'}
          width={'2rem'}
          circle={true}
          src={getAvatar({ user })}
        />
      </div>
    </div>
  </Button>
)

export default ({ user, onSettingsClick, onLogoutClick }) =>
  user ? (
    <PopoverContainer
      popoverAnchor={'above'}
      PopoverComponent={PopoverComponent}
      AnchorComponent={AnchorComponent}
      user={user}
      onSettingsClick={onSettingsClick}
      onLogoutClick={onLogoutClick}
    />
  ) : null
