import React, { Fragment } from 'react'
import PaymentOverlay from '../PaymentOverlay'
import BillingBanner from '../BillingBanner'
import RepoListItem from '../RepoListItem'
import ActivateConfirmDialog from '../ActivateConfirmDialog'

const RepoList = ({ repos, onActivateClick, onRunClick, billingCustomer }) =>
  repos.length
    ? repos.map(repo => (
        <div style={{ paddingBottom: 14 }} key={repo._id}>
          <RepoListItem
            repo={repo}
            onActivateClick={() => onActivateClick({ repo })}
            onRunClick={() => onRunClick({ repo })}
            billingCustomer={billingCustomer}
          />
        </div>
      ))
    : null

export default ({
  billingCustomer,
  owner,
  repos,
  stripePublicKey,
  onActivateClick,
  onRunClick,
  onBillingActionClick,
  showPaymentOverlay,
  showActivateConfirm,
  onPaymentOverlayClick,
  onActivateConfirmDialogOverlayClick,
  onActivateConfirmClick,
  onActivateCancelClick,
  activateConfirmDetails,
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
      billingCustomer={billingCustomer}
    />
    {showActivateConfirm ? (
      <ActivateConfirmDialog
        repoName={activateConfirmDetails.repoName}
        repoOwnerName={activateConfirmDetails.repoOwnerName}
        currency={activateConfirmDetails.currency}
        amount={activateConfirmDetails.amount}
        onConfirmClick={() => onActivateConfirmClick(activateConfirmDetails)}
        onCancelClick={onActivateCancelClick}
        onOverlayClick={onActivateConfirmDialogOverlayClick}
      />
    ) : null}
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
