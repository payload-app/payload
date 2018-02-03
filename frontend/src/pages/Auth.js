import React from 'react'

import { Redirect } from 'react-router-dom'
import { Page } from '../layout'

export const Auth = () => {
  return (
    <Page
      headline="Authenticating..."
      subhead="Identity Verification in Progress..."
      fetch={({ done }) => {
        setTimeout(done, 4000)
      }}
    >
      {({ loading, done }) => {
        if (done) {
          return <Redirect to="/" />
        } else if (loading) {
          return <div>loading</div>
        }
      }}
    </Page>
  )
}

export default Auth
