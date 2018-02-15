import React from 'react'
import { storiesOf } from '@storybook/react'
import RepoList from './index'

const repos = [
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
]

storiesOf('RepoList', module).add('default', () => <RepoList repos={repos} />)
