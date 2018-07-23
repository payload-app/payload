import React from 'react'
import Banner from '../../../components/Banner'

const ImpersonationHeader = ({
  impersonating,
  user,
  onStopImpersonationClick,
}) => {
  return impersonating && user ? (
    <Banner
      type={'error'}
      actionButton={{
        text: 'Stop Impersonating?',
        onClick: onStopImpersonationClick,
      }}
    >{`Impersonating user with email: ${user.email}`}</Banner>
  ) : null
}

export default ImpersonationHeader
