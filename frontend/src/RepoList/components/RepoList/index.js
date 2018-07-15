import React, { Fragment } from 'react'
import { FadeInChildren } from '../../../components'
import PaymentOverlay from '../PaymentOverlay'
import BillingBanner from '../BillingBanner'
import RepoListItem from '../RepoListItem'

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
