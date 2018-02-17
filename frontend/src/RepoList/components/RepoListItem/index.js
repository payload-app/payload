import React from 'react'
import { Text } from '../../../components'
import { red } from '../../../components/style/color'

const ActiveText = () => (
  <Text capitalize={true} background={red}>
    Not Active
  </Text>
)

export default ({ repo }) => (
  <div>
    <Text size={1.5}>
      {repo.owner}/{repo.repo}
    </Text>
    <div>{repo.active ? null : <ActiveText active={repo.active} />}</div>
  </div>
)
