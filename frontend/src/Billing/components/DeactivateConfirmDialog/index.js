import React, { Fragment } from 'react'
import { Popover, ConfirmDialog, Overlay, Text } from '../../../components'
import { invertedText } from '../../../components/style/color'

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
