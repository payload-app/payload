import React from 'react'
import { List } from '../../../components'
import RepoListItem from '../RepoListItem'

export default ({ repos }) => (
  <List
    items={repos.map(repo => ({
      component: <RepoListItem repo={repo} />,
      id: repo._id,
    }))}
  />
)
