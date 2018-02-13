import React from 'react'
import { List, Text } from '../../../components'

export default ({ repos }) => (
  <List
    items={repos.map(repo => ({
      component: (
        <Text>
          {repo.owner}/{repo.repo}
        </Text>
      ),
      id: repo._id,
    }))}
  />
)
