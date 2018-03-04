import React from 'react'
import { Button, IconCached } from '../../../components'
import Header from '../../../Header'

export default ({ onResyncOrgsClick, onResyncReposClick }) => (
  <div>
    <Header />
    <div>
      <Button Icon={IconCached} onClick={onResyncOrgsClick}>
        Resync Organizations?
      </Button>
    </div>
    <div
      style={{
        marginTop: '1rem',
      }}
    >
      <Button Icon={IconCached} onClick={onResyncReposClick}>
        Resync All Repositories?
      </Button>
    </div>
  </div>
)
