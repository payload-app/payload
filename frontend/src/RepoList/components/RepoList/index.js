import React from 'react'
import { List } from '../../../components'
import RepoListItem from '../RepoListItem'

export default ({ repos, onActivateClick, onRunClick }) => (
  <List
    items={repos.map(repo => ({
      component: (
        <div style={{ paddingBottom: 14 }}>
          <RepoListItem
            repo={repo}
            onActivateClick={() => onActivateClick({ repo })}
            onRunClick={() => onRunClick({ repo })}
          />
        </div>
      ),
      id: repo._id,
    }))}
  />
)
