import React from 'react'
import { storiesOf } from '@storybook/react'
import MountAndLoadWrapper from '../../../../.storybook/MountAndLoadWrapper'
import LoadingBar from './index'

storiesOf('LoadingBar', module)
  .add('default', () => <LoadingBar />)
  .add('animate on mount', () => (
    <MountAndLoadWrapper
      render={({ mounted, loading }) => (
        <LoadingBar mounted={mounted} loading={loading} />
      )}
    />
  ))
  .add('mounted = true', () => <LoadingBar mounted={true} />)
  .add('loading = true', () => <LoadingBar mounted={true} loading={true} />)
