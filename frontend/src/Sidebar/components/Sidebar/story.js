import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Provider } from 'react-redux'
import { selector } from '../../../UserMenuItem'
import Sidebar from './index'

const items = [
  {
    display: 'hharnisc',
    key: 'abc122',
  },
  {
    display: 'Payload',
    key: 'abc123',
  },
  {
    display: 'Test Organization',
    key: 'abc124',
  },
]
const value = items[0]

storiesOf('Sidebar', module)
  .addDecorator(getStory => {
    const store = {
      getState: () => ({
        [selector]: {
          user: {
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
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    }
    return (
      <div style={{ width: '18rem', height: '100%' }}>
        <Provider store={store}>{getStory()}</Provider>
      </div>
    )
  })
  .add('default', () => (
    <Sidebar items={items} value={value} onChange={action('on-change')} />
  ))
