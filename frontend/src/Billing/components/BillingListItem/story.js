import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import BillingListItem from './'
import billingCustomer from './sampleData'
import repos from '../sampleRepoData'
import repoOwners from '../sampleOwnerData'

storiesOf('BillingListItem', module)
  .add('default', () => (
    <BillingListItem
      billingCustomer={billingCustomer}
      repos={repos}
      repoOwners={repoOwners}
      onDeactivateClick={action('onDeactivateClick')}
    />
  ))
  .add('no payment source set', () => (
    <BillingListItem
      billingCustomer={{
        ...billingCustomer,
        paymentSourceSet: false,
      }}
      repos={repos}
      repoOwners={repoOwners}
      onDeactivateClick={action('onDeactivateClick')}
    />
  ))
  .add('loading', () => (
    <BillingListItem
      billingCustomer={{
        ...billingCustomer,
        paymentSourceSet: false,
      }}
      repos={repos}
      repoOwners={repoOwners}
      loading={true}
      onDeactivateClick={action('onDeactivateClick')}
    />
  ))
