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
      // TODO: detect env for local vs prod cookies -- webpack flag
      const sessionCookie = Cookies.get('local_payload_session')
      if (sessionCookie) {
        return <Component {...props} />
      }
      return <Redirect to={authRoute()} />
    }}
  />
)
