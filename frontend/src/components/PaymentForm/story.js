import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import PaymentForm from './index'

storiesOf('PaymentForm', module).add('default', () => (
  <PaymentForm
    apiKey={'__STRIPE_PUBLIC_KEY__'}
    customerName={'payload-app'}
    onCancelClick={action('onCancelClick')}
    onSubmit={action('onSubmit')}
  />
))
