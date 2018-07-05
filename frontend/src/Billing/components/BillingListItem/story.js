import React from 'react'
import { storiesOf } from '@storybook/react'
import BillingListItem from './'
import billingCustomer from './sampleData'
import repos from '../sampleRepoData'
import repoOwners from '../sampleOwnerData'

storiesOf('BillingListItem', module).add('default', () => (
  <BillingListItem
    billingCustomer={billingCustomer}
    repos={repos}
    repoOwners={repoOwners}
  />
))
