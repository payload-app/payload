import React, { Fragment } from 'react'
import currencySymbolMap from 'currency-symbol-map'
import { Text, HR } from '../../../components'
import SubscriptionListItem from '../SubscriptionListItem'

const Total = ({ subscriptions }) => (
  <div
    style={{
      display: 'flex',
    }}
  >
    <div
      style={{
        flexGrow: 1,
      }}
    >
      <Text size={3} weight={400}>
        Total
      </Text>
    </div>

    <Text size={3} weight={400}>
      {`${currencySymbolMap(subscriptions[0].currency)}${(
        subscriptions.reduce((p, c) => p + c.amount, 0) / 100
      ).toFixed(2)}/Mo`}
    </Text>
  </div>
)

const SubscriptionList = ({ subscriptions, repos }) => (
  <Fragment>
    {subscriptions.map(subscription => (
      <div
        key={subscription.repoId}
        style={{
          marginBottom: '1rem',
        }}
      >
        <SubscriptionListItem subscription={subscription} repos={repos} />
      </div>
    ))}
    <HR />
    {subscriptions.length ? <Total subscriptions={subscriptions} /> : null}
  </Fragment>
)

export default SubscriptionList
