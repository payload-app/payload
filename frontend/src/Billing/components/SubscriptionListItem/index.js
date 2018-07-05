import React from 'react'
import currencySymbolMap from 'currency-symbol-map'
import { Text, Button } from '../../../components'

const SubscriptionListItem = ({ subscription, repos, onDeactivateClick }) => {
  const repo = repos.find(rep => subscription.repoId === rep._id)
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          flexGrow: 1,
        }}
      >
        <Text size={2}>{`${repo.owner}/${repo.repo}`}</Text>
      </div>
      <div
        style={{
          margin: '0 1rem',
        }}
      >
        <Text size={2}>{`${currencySymbolMap(subscription.currency)}${(
          subscription.amount / 100.0
        ).toFixed(2)}`}</Text>
      </div>
      <div>
        <Button onClick={onDeactivateClick}>Deactivate</Button>
      </div>
    </div>
  )
}

export default SubscriptionListItem
