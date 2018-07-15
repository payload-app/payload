import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import ConfirmDialog from './index'

storiesOf('ConfirmDialog', module)
  .add('default', () => (
    <ConfirmDialog
      title={'Are You Sure?'}
      onConfirmClick={action('onConfirmClick')}
      onCancelClick={action('onCancelClick')}
    >
      Are you sure this is the way to go? It cannot be undone.
    </ConfirmDialog>
  ))
  .add('width = 50 rem', () => (
    <ConfirmDialog
      title={'Are You Sure?'}
      onConfirmClick={action('onConfirmClick')}
      onCancelClick={action('onCancelClick')}
      width={50}
    >
      Are you sure this is the way to go? It cannot be undone.
    </ConfirmDialog>
  ))
