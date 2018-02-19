import React from 'react'
import Cookies from 'js-cookie'
import { Route } from 'react-router'
import { Redirect } from 'react-router-dom'
import { authRoute } from '../Routing'

export default ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      // TODO: write middleware to handle 401 from rpc and redirect to auth
      // TODO: detect env for local vs prod cookies -- webpack flag
      const sessionCookie = Cookies.get('local_payload_session')
      if (sessionCookie) {
        return <Component {...props} />
      }
      return <Redirect to={authRoute()} />
    }}
  />
)
