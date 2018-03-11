import React from 'react'
import Header from '../Header'
import RepoSelector from '../RepoSelector'
import RepoList from '../RepoList'
import UserMenuItem from '../UserMenuItem'

export default () => (
  <div
    style={{
      paddingTop: 60,
      paddingRight: 60,
      paddingLeft: 60,
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Header />
    <div style={{ display: 'flex', marginTop: 50, flex: 1 }}>
      <div
        style={{
          marginRight: 40,
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
        }}
      >
        <RepoSelector />
        <UserMenuItem />
      </div>
      <div style={{ flex: 1 }}>
        <RepoList />
      </div>
    </div>
  </div>
)
