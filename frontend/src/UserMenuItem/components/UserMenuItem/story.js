import React from 'react'
import { storiesOf } from '@storybook/react'
import UserMenuItem from './'

const user = {
  _id: '5a9aecd5d788d2001e95cbec',
  email: 'hharnisc@gmail.com',
  accounts: {
    github: {
      avatar: 'https://avatars0.githubusercontent.com/u/1388079?v=4',
      username: 'hharnisc',
      name: 'Harrison Harnisch',
    },
  },
  organizationIds: [
    '5a9aecd997cd03001faff186',
    '5a9aecd997cd03001faff187',
    '5a9aecd997cd03001faff188',
    '5a9aecd997cd03001faff189',
  ],
}

storiesOf('UserMenuItem', module).add('default', () => (
  <div
    style={{
      width: '30rem',
      height: '60rem',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <div style={{ flexGrow: 1 }} />
    <UserMenuItem user={user} />
  </div>
))
