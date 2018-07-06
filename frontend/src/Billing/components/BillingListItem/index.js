import React, { Fragment } from 'react'
import currencySymbolMap from 'currency-symbol-map'
import { Text, Panel, Button } from '../../../components'
import SubscriptionList from '../SubscriptionList'

const Total = ({ subscriptions }) => (
  <div>
    <Text size={4} capitalize>
      {`${currencySymbolMap(subscriptions[0].currency)}${(
        subscriptions.reduce((p, c) => p + c.amount, 0) / 100
      ).toFixed(2)}/Mo`}
    </Text>
  </div>
)

const PaymentSource = ({ paymentSourceLastFour, paymentSourceSet }) => (
  <Panel
    TitleComponent={
      <Text size={2} capitalize>
        Payment Source
      </Text>
    }
  >
    {paymentSourceSet ? (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div>
          <Text
            size={3}
            weight={400}
            capitalize
          >{`****-****-****-${paymentSourceLastFour}`}</Text>
        </div>
        <div
          style={{
            marginTop: '1rem',
          }}
        >
          <Button>Update Payment Source</Button>
        </div>
      </div>
    ) : (
      <Fragment>
        <div>
          <Text size={3} weight={400} capitalize>{`N/A`}</Text>
        </div>
        <div
          style={{
            marginTop: '1rem',
          }}
        >
          <Button>Set Payment Source</Button>
        </div>
      </Fragment>
    )}
  </Panel>
)

const BillingListItem = ({ billingCustomer, repos, repoOwners }) => (
  <Panel
    TitleComponent={
      <Text size={3} capitalize>
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
    <div
      style={{
        display: 'flex',
        marginTop: '2rem',
        alignItems: 'center',
      }}
    >
      <PaymentSource {...billingCustomer} />
      <div style={{ flexGrow: 1 }} />
      {billingCustomer.subscriptions.length ? (
        <Total subscriptions={billingCustomer.subscriptions} />
      ) : null}
    </div>
  </Panel>
)

export default BillingListItem
