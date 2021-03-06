import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import BillingList from './'
import billingCustomers from './sampleData'
import repos from '../sampleRepoData'
import repoOwners from '../sampleOwnerData'

storiesOf('BillingList', module)
  .add('default', () => (
    <BillingList
      billingCustomers={billingCustomers}
      repos={repos}
      repoOwners={repoOwners}
      onDeactivateClick={action('onDeactivateClick')}
      onSetPaymentSourceClick={action('onSetPaymentSourceClick')}
    />
  ))
  .add('loading', () => (
    <BillingList
      billingCustomers={billingCustomers}
      repos={repos}
      repoOwners={repoOwners}
      loading={true}
      onDeactivateClick={action('onDeactivateClick')}
      onSetPaymentSourceClick={action('onSetPaymentSourceClick')}
    />
  ))
  .add('showPaymentOverlay', () => (
    <BillingList
      billingCustomers={billingCustomers}
      repos={repos}
      repoOwners={repoOwners}
      selectedBillingCustomer={billingCustomers[0]._id}
      showPaymentOverlay={true}
      onDeactivateClick={action('onDeactivateClick')}
      onSetPaymentSourceClick={action('onSetPaymentSourceClick')}
      onPaymentOverlayClick={action('onPaymentOverlayClick')}
      onBillingCancelClick={action('onBillingCancelClick')}
      onBillingSubmit={action('onBillingSubmit')}
      stripePublicKey={'__STRIPE_PUBLIC_KEY__'}
    />
  ))
