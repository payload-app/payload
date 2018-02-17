import React from 'react'
import { Text } from '../../../components'

export default ({ repo }) => (
  <Text>
    {repo.owner}/{repo.repo}
  </Text>
)
