import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import ActivateConfirmDialog from './index'

storiesOf('ActivateConfirmDialog', module).add('default', () => (
  <ActivateConfirmDialog
    repoName={'payload'}
    repoOwnerName={'payload-app'}
    currency={'usd'}
    amount={2000}
    onConfirmClick={action('onConfirmClick')}
    onCancelClick={action('onCancelClick')}
    onOverlayClick={action('onOverlayClick')}
  />
))
