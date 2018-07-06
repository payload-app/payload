import React from 'react'
import BillingListItem from '../BillingListItem'

const BillingList = ({ billingCustomers, repos, repoOwners }) =>
  billingCustomers.map(billingCustomer => (
    <BillingListItem
      key={billingCustomer._id}
      billingCustomer={billingCustomer}
      repos={repos}
      repoOwners={repoOwners}
    />
  ))

export default BillingList
