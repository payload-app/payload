import React, { Fragment } from 'react'
import { Popover, PaymentForm, Overlay } from '../../../components'

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

export default PaymentOverlay
