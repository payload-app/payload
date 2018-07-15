import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import DeactivateConfirmDialog from './index'

storiesOf('DeactivateConfirmDialog', module).add('default', () => (
  <DeactivateConfirmDialog
    repoName={'payload'}
    repoOwnerName={'payload-app'}
    currency={'usd'}
    amount={2000}
    onConfirmClick={action('onConfirmClick')}
    onCancelClick={action('onCancelClick')}
    onOverlayClick={action('onOverlayClick')}
  />
))
