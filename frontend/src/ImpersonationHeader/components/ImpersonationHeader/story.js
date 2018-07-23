import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import ImpersonationHeader from './index'

const user = {
  email: 'test@test.com',
}

storiesOf('ImpersonationHeader', module)
  .add('default', () => (
    <ImpersonationHeader
      impersonating={true}
      user={user}
      onStopImpersonationClick={action('onStopImpersonationClick')}
    />
  ))
  .add('impersonating = false', () => (
    <ImpersonationHeader impersonating={false} />
  ))
