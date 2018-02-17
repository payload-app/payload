import React from 'react'
import { List } from '../../../components'
import RepoListItem from '../RepoListItem'

export default ({ repos, onActivateClick }) => (
  <List
    items={repos.map(repo => ({
      component: (
        <RepoListItem
          repo={repo}
          onActivateClick={() => onActivateClick(repo)}
        />
      ),
      id: repo._id,
    }))}
  />
)
