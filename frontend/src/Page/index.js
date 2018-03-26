import React from 'react'
import Header from '../Header'
import Sidebar from '../Sidebar'

export default ({ children }) => (
  <div
    style={{
      paddingTop: 40,
      paddingRight: 50,
      paddingLeft: 50,
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
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
        <Sidebar />
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ flex: 1, marginTop: 50 }}>{children}</div>
      </div>
    </div>
  </div>
)
