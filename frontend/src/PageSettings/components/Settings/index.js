import React from 'react'
import { Button, IconCached } from '@payloadapp/components'
import Page from '../../../Page'
import BillingPage from '../../../Billing'

export default ({
  organizationsLoading,
  repositoriesLoading,
  onResyncOrgsClick,
  onResyncReposClick,
  match = {},
}) => {
  const page = match.params ? match.params.settingsType : ''
  return (
    <Page>
      {page === 'sync' && (
        <div>
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
      )}

      {page === 'billing' && <BillingPage />}
    </Page>
  )
}
