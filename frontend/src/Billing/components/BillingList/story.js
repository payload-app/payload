import React from 'react'
import { storiesOf } from '@storybook/react'
import BillingList from './'
import billingCustomers from './sampleData'
import repos from '../sampleRepoData'
import repoOwners from '../sampleOwnerData'

storiesOf('BillingList', module).add('default', () => (
  <BillingList
    billingCustomers={billingCustomers}
    repos={repos}
    repoOwners={repoOwners}
  />
))
