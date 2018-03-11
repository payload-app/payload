import React from 'react'
import Header from '../Header'
import RepoSelector from '../RepoSelector'
import RepoList from '../RepoList'

export default () => (
  <div style={{ padding: 60 }}>
    <Header />
    <div style={{ display: 'flex', marginTop: 50 }}>
      <div style={{ marginRight: 40 }}>
        <RepoSelector />
      </div>
      <div style={{ flex: 1 }}>
        <RepoList />
      </div>
    </div>
  </div>
)
