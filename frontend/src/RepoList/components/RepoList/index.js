import React, { Fragment } from 'react'
import { FadeInChildren, Banner } from '../../../components'
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

export default ({ owner, repos, onActivateClick, onRunClick }) => (
  <Fragment>
    <Banner>Your trial will expire</Banner>
    <RepoList
      owner={owner}
      repos={repos}
      onActivateClick={onActivateClick}
      onRunClick={onRunClick}
    />
  </Fragment>
)
