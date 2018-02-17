import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import RepoListItem from './index'

const repo = {
  owner: 'payload-app',
  repo: 'org-webhook-tester',
  _id: 'abc123',
  active: true,
}

const inactiveRepo = {
  ...repo,
  active: false,
}

storiesOf('RepoListItem', module)
  .add('default', () => (
    <RepoListItem repo={repo} onActivateClick={action('Activate Clicked')} />
  ))
  .add('inactive', () => (
    <RepoListItem
      repo={inactiveRepo}
      onActivateClick={action('Activate Clicked')}
    />
  ))
