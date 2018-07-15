import React, { Fragment } from 'react'
import currencySymbolMap from 'currency-symbol-map'
import { Popover, ConfirmDialog, Overlay, Text } from '../../../components'
import { invertedText } from '../../../components/style/color'

const ActivateConfirmDialog = ({
  repoName,
  repoOwnerName,
  amount,
  currency,
  onOverlayClick,
  onConfirmClick,
  onCancelClick,
}) => (
  <Fragment>
    <Popover anchor={'none'}>
      <ConfirmDialog
        maxWidth={50}
        title={`Activate ${repoName}/${repoOwnerName}?`}
        onConfirmClick={onConfirmClick}
        onCancelClick={onCancelClick}
      >
        Activating{' '}
        <Text size={2} weight={400} color={invertedText}>
          {repoName}/{repoOwnerName}
        </Text>{' '}
        will add{' '}
        <Text size={2} weight={400} color={invertedText}>
          {currencySymbolMap(currency)}
          {amount / 100}
        </Text>{' '}
        to your monthly subscription.
      </ConfirmDialog>
    </Popover>
    <Overlay onClick={onOverlayClick} />
  </Fragment>
)

export default ActivateConfirmDialog
