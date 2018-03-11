import React from 'react'
import Header from '../Header'
import RepoSelector from '../RepoSelector'
import RepoList from '../RepoList'
import UserMenuItem from '../UserMenuItem'

export default () => (
  <div>
    <Header />
    <div style={{ width: '20rem', margin: '2rem 0' }}>
      <UserMenuItem />
    </div>
    <div>
      <RepoSelector />
    </div>
    <div>
      <RepoList />
    </div>
  </div>
)
