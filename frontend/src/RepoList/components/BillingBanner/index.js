import React from 'react'
import { Banner } from '../../../components'

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

export default BillingBanner
