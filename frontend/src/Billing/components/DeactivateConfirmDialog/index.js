import React, { Fragment } from 'react'
import {
  Popover,
  ConfirmDialog,
  Overlay,
  Text,
  style,
} from '@payloadapp/components'
const { color: { invertedText } } = style

const DeactivateConfirmDialog = ({
  repoName,
  repoOwnerName,
  onOverlayClick,
  onConfirmClick,
  onCancelClick,
}) => (
  <Fragment>
    <Popover anchor={'none'}>
      <ConfirmDialog
        maxWidth={50}
        title={`Deactivate ${repoOwnerName}/${repoName}?`}
        onConfirmClick={onConfirmClick}
        onCancelClick={onCancelClick}
      >
        Deactivating will cancel your monthly subscription for{' '}
        <Text size={2} weight={400} color={invertedText}>
          {repoName}/{repoOwnerName}
        </Text>{' '}
        and stop calculating build sizes.
      </ConfirmDialog>
    </Popover>
    <Overlay onClick={onOverlayClick} />
  </Fragment>
)

export default DeactivateConfirmDialog
