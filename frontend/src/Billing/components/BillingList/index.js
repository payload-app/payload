import React, { Fragment } from 'react'
import BillingListItem from '../BillingListItem'
import PaymentOverlay from '../PaymentOverlay'
import DeactivateConfirmDialog from '../DeactivateConfirmDialog'

const getSelectedRepoOwner = ({
  billingCustomers,
  selectedBillingCustomer,
  repoOwners,
}) => {
  const billingCustomer = billingCustomers.find(
    customer => customer._id === selectedBillingCustomer,
  )
  return repoOwners.find(
    repoOwner =>
      repoOwner.id === billingCustomer.ownerId &&
      repoOwner.ownerType === billingCustomer.ownerType,
  )
}

const BillingList = ({
  billingCustomers,
  repos,
  repoOwners,
  selectedBillingCustomer,
  showPaymentOverlay,
  showDeactivateConfirm,
  loading,
  onDeactivateClick,
  onSetPaymentSourceClick,
  onPaymentOverlayClick,
  onBillingCancelClick,
  onBillingSubmit,
  stripePublicKey,
  deactivateConfirmDetails,
  onDeactivateConfirmClick,
  onDeactivateCancelClick,
  onDeactivateConfirmDialogOverlayClick,
}) => (
  <Fragment>
    {billingCustomers.map(billingCustomer => (
      <BillingListItem
        key={billingCustomer._id}
        billingCustomer={billingCustomer}
        repos={repos}
        repoOwners={repoOwners}
        loading={loading}
        onDeactivateClick={onDeactivateClick}
        onSetPaymentSourceClick={onSetPaymentSourceClick}
      />
    ))}
    {showDeactivateConfirm ? (
      <DeactivateConfirmDialog
        {...deactivateConfirmDetails}
        onConfirmClick={() =>
          onDeactivateConfirmClick(deactivateConfirmDetails)
        }
        onCancelClick={onDeactivateCancelClick}
        onOverlayClick={onDeactivateConfirmDialogOverlayClick}
      />
    ) : null}
    {showPaymentOverlay ? (
      <PaymentOverlay
        billingCustomer={billingCustomers.find(
          customer => customer._id === selectedBillingCustomer,
        )}
        onPaymentOverlayClick={onPaymentOverlayClick}
        onBillingCancelClick={onBillingCancelClick}
        onBillingSubmit={onBillingSubmit}
        owner={
          getSelectedRepoOwner({
            billingCustomers,
            selectedBillingCustomer,
            repoOwners,
          }).name
        }
        stripePublicKey={stripePublicKey}
      />
    ) : null}
  </Fragment>
)

export default BillingList
