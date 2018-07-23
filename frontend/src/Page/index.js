import React from 'react'
import Header from '../Header'
import Sidebar from '../Sidebar'
import ImpersonationHeader from '../ImpersonationHeader'

const Page = ({ children }) => (
  <div
    style={{
      paddingTop: 40,
      paddingRight: 50,
      paddingLeft: 50,
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      margin: '0 auto',
      maxWidth: '120rem',
    }}
  >
    <ImpersonationHeader />
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
      <div style={{ flex: 1, overflowY: 'auto', height: '100%' }}>
        <div
          style={{
            flex: 1,
            paddingTop: 50,
            height: '100%',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  </div>
)

export default Page
