import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import RepoSelectorItem from './index'

storiesOf('RepoSelectorItem', module)
  .add('default', () => <RepoSelectorItem name={'TestBigOrg'} />)
  .add('onClick fire action', () => (
    <RepoSelectorItem name={'TestBigOrg'} onClick={action('on-click')} />
  ))
  .add('active = true', () => (
    <RepoSelectorItem name={'TestBigOrg'} active={true} />
  ))
