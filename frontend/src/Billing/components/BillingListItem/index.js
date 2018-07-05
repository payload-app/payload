import React from 'react'
import { Text, Panel } from '../../../components'
import SubscriptionList from '../SubscriptionList'

const BillingListItem = ({ billingCustomer, repos, repoOwners }) => (
  <Panel
    TitleComponent={
      <Text size={2.4}>
        {
          repoOwners.find(
            owner =>
              billingCustomer.ownerId === owner.id &&
              billingCustomer.ownerType === owner.ownerType,
          ).name
        }
      </Text>
    }
  >
    <SubscriptionList
      subscriptions={billingCustomer.subscriptions}
      repos={repos}
    />
  </Panel>
)

export default BillingListItem
