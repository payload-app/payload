import React from 'react'
import { Text, Button } from '../../../components'
import { red } from '../../../components/style/color'

const ActiveText = () => (
  <Text capitalize={true} background={red}>
    Not Active
  </Text>
)

export default ({ repo, onActivateClick }) => (
  <div>
    <Text size={1.5}>
      {repo.owner}/{repo.repo}
    </Text>
    <div
      style={{
        display: 'flex',
        margin: '1rem 0',
      }}
    >
      <div
        style={{
          flexGrow: 1,
        }}
      >
        {repo.active ? (
          <Text>Repo Is Active</Text>
        ) : (
          <ActiveText active={repo.active} />
        )}
      </div>
      <div>
        {repo.active ? null : (
          <Button onClick={onActivateClick} disabled={repo.activating}>
            {repo.activating ? 'Activating...' : 'Activate?'}
          </Button>
        )}
      </div>
    </div>
  </div>
)
