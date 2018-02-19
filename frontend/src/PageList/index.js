import React from 'react'
import Header from '../Header'
import RepoSelector from '../RepoSelector'
import RepoList from '../RepoList'

export default () => (
  <div>
    <Header />
    <div>
      <RepoSelector />
    </div>
    <div>
      <RepoList />
    </div>
  </div>
)
