import React from 'react'
import { storiesOf } from '@storybook/react'
import Text from '../Text'
import ConfirmDialog from './index'

storiesOf('ConfirmDialog', module).add('default', () => (
  <ConfirmDialog title={'Are You Sure?'}>
    Are you sure this is the way to go? It cannot be undone.
  </ConfirmDialog>
))
