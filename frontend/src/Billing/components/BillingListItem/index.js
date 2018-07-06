import React, { Fragment } from 'react'
import currencySymbolMap from 'currency-symbol-map'
import { Text, Panel, Button, Banner } from '../../../components'
import SubscriptionList from '../SubscriptionList'

const calculateDaysFromToday = ({ date }) =>
  (
    (new Date(date).getTime() - new Date().getTime()) /
    1000 /
    60 /
    60 /
    24
  ).toFixed(3)

const BillingBanner = ({ trialEnd }) => {
  const expireDays = calculateDaysFromToday({ date: trialEnd })
  if (expireDays > 3.0) {
    return <Banner>{`Trial Expires In ${expireDays} Days`}</Banner>
  } else if (expireDays < 3.0 && expireDays > 0.0) {
    return (
      <Banner type={'warning'}>{`Trial Expires In ${expireDays} Days`}</Banner>
    )
  } else {
    return <Banner type={'error'}>{`Trial Has Expired`}</Banner>
  }
}

const Total = ({ subscriptions }) => (
  <div>
    <Text size={4} capitalize>
      {`${currencySymbolMap(subscriptions[0].currency)}${(
        subscriptions.reduce((p, c) => p + c.amount, 0) / 100
      ).toFixed(2)}/Mo`}
    </Text>
  </div>
)

const PaymentSource = ({
  paymentSourceLastFour,
  paymentSourceSet,
  trialEnd,
}) => (
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
          <BillingBanner trialEnd={trialEnd} />
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

const BillingListItem = ({ billingCustomer, repos, repoOwners, loading }) => (
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
    {loading ? (
      <Text size={2}>Loading...</Text>
    ) : (
      <div>
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
      </div>
    )}
  </Panel>
)

export default BillingListItem
