import React from 'react'
import Cookies from 'js-cookie'
import { Route } from 'react-router'
import { Redirect } from 'react-router-dom'
import { authRoute } from '../Routing'

// NOTE: This isn't used anymore and should be delete, keeping it around for a bit for reference

export default ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      const sessionCookie = Cookies.get('payload_session_token')
      if (sessionCookie) {
        return <Component {...props} />
      }
      return <Redirect to={authRoute()} />
    }}
  />
)
