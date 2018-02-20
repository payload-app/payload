// @flow
import type { Repo } from 'api-types'
import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import RepoList from './index'

const repos: Array<Repo> = [
  {
    owner: 'payload-app',
    repo: 'org-webhook-tester',
    _id: 'abc123',
    active: true,
  },
  {
    owner: 'payload-app',
    repo: 'payload',
    _id: 'abc124',
    active: false,
  },
  {
    owner: 'payload-app',
    repo: 'payload',
    _id: 'abc124',
    active: false,
    activating: true,
  },
]

storiesOf('RepoList', module).add('default', () => (
  <RepoList repos={repos} onActivateClick={action('Activate Clicked')} />
))
