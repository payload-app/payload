import React from 'react'
import SubscriptionListItem from '../SubscriptionListItem'

const SubscriptionList = ({ subscriptions, repos }) =>
  subscriptions.map(subscription => (
    <div
      key={subscription.repoId}
      style={{
        marginBottom: '1rem',
      }}
    >
      <SubscriptionListItem subscription={subscription} repos={repos} />
    </div>
  ))

export default SubscriptionList
