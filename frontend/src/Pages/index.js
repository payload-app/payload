import React from 'react'
import { Switch, Route } from 'react-router'
import { listRoute, runRoute, baseRoute, authRoute } from '../Routing'
import ProtectedRoute from './ProtectedRoute'
import Auth from '../Auth'
import List from './List'
import Loading from './Loading'
import Run from '../Run'

export default () => (
  <Switch>
    <ProtectedRoute exact path={baseRoute()} component={Loading} />
    <ProtectedRoute path={listRoute()} component={List} />
    <Route path={runRoute()} component={Run} />
    <Route path={authRoute()} component={Auth} />
  </Switch>
)
