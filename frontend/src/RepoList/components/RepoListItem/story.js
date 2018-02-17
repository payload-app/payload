import React from 'react'
import { storiesOf } from '@storybook/react'
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
  .add('default', () => <RepoListItem repo={repo} />)
  .add('inactive', () => <RepoListItem repo={inactiveRepo} />)
