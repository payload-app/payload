import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import RepoSelector from './index'

const repoOwners = [
  {
    name: 'hharnisc',
    type: 'github',
    ownerType: 'user',
    id: 'abc122',
  },
  {
    name: 'Payload',
    type: 'github',
    ownerType: 'organization',
    id: 'abc123',
  },
  {
    name: 'Test Organization',
    type: 'github',
    ownerType: 'organization',
    id: 'abc124',
  },
]
const value = repoOwners[0]

storiesOf('RepoSelector', module).add('default', () => (
  <RepoSelector
    repoOwners={repoOwners}
    value={value}
    onChange={action('on-change')}
  />
))
