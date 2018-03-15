import React from 'react'
import { Button, IconCached } from '../../../components'
import Page from '../../../Page'

export default ({
  organizationsLoading,
  repositoriesLoading,
  onResyncOrgsClick,
  onResyncReposClick,
}) => (
  <Page>
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
  </Page>
)
