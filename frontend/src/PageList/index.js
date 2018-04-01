import React from 'react'
import Page from '../Page'
import RepoList from '../RepoList'

export default ({ match: { params: { owner } } }) => (
  <Page>
    <RepoList owner={owner} />
  </Page>
)
