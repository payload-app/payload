import React, { Fragment } from 'react'
import {
  FadeInChildren,
  Banner,
  Popover,
  PaymentForm,
  Overlay,
} from '../../../components'
import RepoListItem from '../RepoListItem'

const calculateDaysFromToday = ({ date }) =>
  (
    (new Date(date).getTime() - new Date().getTime()) /
    1000 /
    60 /
    60 /
    24
  ).toFixed(3)

const MarginBottom = ({ children }) => (
  <div style={{ marginBottom: '1rem' }}> {children}</div>
)

const actionButtonSettings = ({ text, onClick }) => ({
  text,
  onClick: e => {
    e.preventDefault()
    onClick()
  },
})

const BillingBanner = ({
  loading,
  paymentSourceSet,
  trialEnd,
  onBillingActionClick,
  owner,
}) => {
  const expireDays = calculateDaysFromToday({ date: trialEnd })
  if (loading === undefined || loading || paymentSourceSet) {
    return null
  } else if (expireDays > 3.0) {
    return (
      <MarginBottom>
        <Banner
          actionButton={actionButtonSettings({
            text: 'Set Payment Source',
            onClick: onBillingActionClick,
          })}
        >{`Trial For ${owner} Expires In ${expireDays} Days`}</Banner>
      </MarginBottom>
    )
  } else if (expireDays < 3.0 && expireDays > 0.0) {
    return (
      <MarginBottom>
        <Banner
          type={'warning'}
          actionButton={actionButtonSettings({
            text: 'Set Payment Source',
            onClick: onBillingActionClick,
          })}
        >{`Trial For ${owner} Expires In ${expireDays} Days`}</Banner>
      </MarginBottom>
    )
  } else {
    return (
      <MarginBottom>
        <Banner
          type={'error'}
          actionButton={actionButtonSettings({
            text: 'Set Payment Source',
            onClick: onBillingActionClick,
          })}
        >{`Trial For ${owner} Has Expired`}</Banner>
      </MarginBottom>
    )
  }
}

const RepoList = ({ owner, repos, onActivateClick, onRunClick }) =>
  repos.length ? (
    <FadeInChildren speed={100} key={owner}>
      {repos.map(repo => (
        <div style={{ paddingBottom: 14 }} key={repo._id}>
          <RepoListItem
            repo={repo}
            onActivateClick={() => onActivateClick({ repo })}
            onRunClick={() => onRunClick({ repo })}
          />
        </div>
      ))}
    </FadeInChildren>
  ) : null

const PaymentOverlay = ({
  billingCustomer,
  owner,
  stripePublicKey,
  onPaymentOverlayClick,
  onBillingCancelClick,
  onBillingSubmit,
}) => (
  <Fragment>
    <Popover anchor={'none'}>
      <PaymentForm
        apiKey={stripePublicKey}
        onCancelClick={onBillingCancelClick}
        onSubmit={({ id: paymentSource, card: { last4: lastFour } }) =>
          onBillingSubmit({
            ownerId: billingCustomer.ownerId,
            ownerType: billingCustomer.ownerType,
            paymentSource,
            lastFour,
          })
        }
        customerName={owner}
      />
    </Popover>
    <Overlay onClick={onPaymentOverlayClick} />
  </Fragment>
)
export default ({
  billingCustomer,
  owner,
  repos,
  stripePublicKey,
  onActivateClick,
  onRunClick,
  onBillingActionClick,
  showPaymentOverlay,
  onPaymentOverlayClick,
  onBillingCancelClick,
  onBillingSubmit,
}) => (
  <Fragment>
    <BillingBanner
      {...billingCustomer}
      owner={owner}
      onBillingActionClick={onBillingActionClick}
    />
    <RepoList
      owner={owner}
      repos={repos}
      onActivateClick={onActivateClick}
      onRunClick={onRunClick}
    />
    {showPaymentOverlay ? (
      <PaymentOverlay
        billingCustomer={billingCustomer}
        onPaymentOverlayClick={onPaymentOverlayClick}
        onBillingCancelClick={onBillingCancelClick}
        onBillingSubmit={onBillingSubmit}
        owner={owner}
        stripePublicKey={stripePublicKey}
      />
    ) : null}
  </Fragment>
)
