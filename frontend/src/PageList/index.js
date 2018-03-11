import React from 'react'
import Header from '../Header'
import RepoSelector from '../RepoSelector'
import RepoList from '../RepoList'
import UserMenuItem from '../UserMenuItem'

export default () => (
  <div
    style={{
      paddingTop: 40,
      paddingRight: 50,
      paddingLeft: 50,
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Header />
    <div style={{ display: 'flex', flex: 1 }}>
      <div
        style={{
          marginRight: 40,
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
          width: 180,
          marginTop: 60,
        }}
      >
        <RepoSelector />
        <UserMenuItem />
      </div>
      <div style={{ flex: 1, overflowY: 'scroll' }}>
        <div style={{ flex: 1, marginTop: 50 }}>
          <RepoList />
        </div>
      </div>
    </div>
  </div>
)
