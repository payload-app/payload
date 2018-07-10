import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import PaymentOverlay from './'
import billingCustomer from '../BillingListItem/sampleData'
import ownerData from '../sampleOwnerData'

storiesOf('PaymentOverlay', module).add('default', () => (
  <PaymentOverlay
    billingCustomer={billingCustomer}
    owner={ownerData.find(owner => owner.id === billingCustomer.ownerId).name}
    stripePublicKey={'__STRIPE_PUBLIC_KEY__'}
    onPaymentOverlayClick={action('onPaymentOverlayClick')}
    onBillingCancelClick={action('onBillingCancelClick')}
    onBillingSubmit={action('onBillingSubmit')}
  />
))
