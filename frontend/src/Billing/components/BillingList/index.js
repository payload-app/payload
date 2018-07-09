import React from 'react'
import BillingListItem from '../BillingListItem'

const BillingList = ({
  billingCustomers,
  repos,
  repoOwners,
  loading,
  onDeactivateClick,
}) =>
  billingCustomers.map(billingCustomer => (
    <BillingListItem
      key={billingCustomer._id}
      billingCustomer={billingCustomer}
      repos={repos}
      repoOwners={repoOwners}
      loading={loading}
      onDeactivateClick={onDeactivateClick}
    />
  ))

export default BillingList
