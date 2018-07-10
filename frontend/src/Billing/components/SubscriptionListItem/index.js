import React from 'react'
import currencySymbolMap from 'currency-symbol-map'
import { Text, Button } from '../../../components'
import { text, background } from '../../../components/style/color'

const SubscriptionListItem = ({ subscription, repos, onDeactivateClick }) => {
  const repo = repos.find(rep => subscription.repoId === rep._id)
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        marginTop: '1rem',
      }}
    >
      <div
        style={{
          flexGrow: 1,
        }}
      >
        <Text size={2} capitalize>{`${repo.owner}/${repo.repo}`}</Text>
      </div>
      <div
        style={{
          margin: '0 1rem',
        }}
      >
        <Text size={2} capitalize>{`${currencySymbolMap(
          subscription.currency,
        )}${(subscription.amount / 100.0).toFixed(2)}/Mo`}</Text>
      </div>
      <div>
        <Button
          color={text}
          background={background}
          onClick={onDeactivateClick}
        >
          Deactivate
        </Button>
      </div>
    </div>
  )
}

export default SubscriptionListItem
