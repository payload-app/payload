import React from 'react'
import { storiesOf } from '@storybook/react'
import RepoList from './index'

const repos = [
  {
    owner: 'payload-app',
    repo: 'org-webhook-tester',
    _id: 'abc123',
  },
  {
    owner: 'payload-app',
    repo: 'payload',
    _id: 'abc124',
  },
]

storiesOf('RepoList', module).add('default', () => <RepoList repos={repos} />)
