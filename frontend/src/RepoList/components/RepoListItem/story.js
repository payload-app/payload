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

const activatingRepo = {
  ...inactiveRepo,
  activating: true,
}

const activeRepoWithLastRun = {
  ...repo,
  lastDefaultRun: {
    branch: 'master',
    sha: 'bcefa91c942d700f387156e8ee2615ae05d67f7a',
    created: new Date('December 3, 1992 00:24:00'),
    start: new Date('December 3, 1992 00:25:00'),
    stop: new Date('December 3, 1992 00:26:00'),
  },
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
  .add('activating', () => (
    <RepoListItem
      repo={activatingRepo}
      onActivateClick={action('Activate Clicked')}
    />
  ))
  .add('activeRepoWithLastRun', () => (
    <RepoListItem
      repo={activeRepoWithLastRun}
      onActivateClick={action('Activate Clicked')}
    />
  ))
  .add('activeRepoWithLastRunError', () => (
    <RepoListItem
      repo={activeRepoWithLastRunError}
      onActivateClick={action('Activate Clicked')}
    />
  ))
