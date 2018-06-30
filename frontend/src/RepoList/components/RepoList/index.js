import React, { Fragment } from 'react'
import { FadeInChildren, Banner } from '../../../components'
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

const BillingBanner = ({ loading, paymentSourceSet, trialEnd }) => {
  const expireDays = calculateDaysFromToday({ date: trialEnd })
  if (loading === undefined || loading || paymentSourceSet) {
    return null
  } else if (expireDays > 3.0) {
    return (
      <MarginBottom>
        <Banner>{`Trial Expires In ${expireDays} Days`}</Banner>
      </MarginBottom>
    )
  } else if (expireDays < 3.0 && expireDays > 0.0) {
    return (
      <MarginBottom>
        <Banner
          type={'warning'}
        >{`Trial Expires In ${expireDays} Days`}</Banner>
      </MarginBottom>
    )
  } else {
    return (
      <MarginBottom>
        <Banner type={'error'}>{`Trial Has Expired`}</Banner>
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

export default ({
  billingCustomer,
  owner,
  repos,
  onActivateClick,
  onRunClick,
}) => (
  <Fragment>
    <BillingBanner {...billingCustomer} />
    <RepoList
      owner={owner}
      repos={repos}
      onActivateClick={onActivateClick}
      onRunClick={onRunClick}
    />
  </Fragment>
)
