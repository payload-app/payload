import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
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

storiesOf('Sidebar', module).add('default', () => (
  <Sidebar items={items} value={value} onChange={action('on-change')} />
))
