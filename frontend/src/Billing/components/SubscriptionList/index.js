import React from 'react'
import SubscriptionListItem from '../SubscriptionListItem'

const SubscriptionList = ({ subscriptions, repos, onDeactivateClick }) =>
  subscriptions.map(subscription => (
    <div
      key={subscription.repoId}
      style={{
        marginBottom: '1rem',
      }}
    >
      <SubscriptionListItem
        subscription={subscription}
        repos={repos}
        onDeactivateClick={() => onDeactivateClick({ subscription })}
      />
    </div>
  ))

export default SubscriptionList
