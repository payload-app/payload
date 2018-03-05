import React from 'react'
import { Button, IconCached } from '../../../components'
import Header from '../../../Header'

export default ({
  organizationsLoading,
  repositoriesLoading,
  onResyncOrgsClick,
  onResyncReposClick,
}) => (
  <div>
    <Header />
    <div>
      <Button
        disabled={organizationsLoading}
        Icon={IconCached}
        onClick={onResyncOrgsClick}
      >
        Resync Organizations?
      </Button>
    </div>
    <div
      style={{
        marginTop: '1rem',
      }}
    >
      <Button
        disabled={repositoriesLoading}
        Icon={IconCached}
        onClick={onResyncReposClick}
      >
        Resync All Repositories?
      </Button>
    </div>
  </div>
)
