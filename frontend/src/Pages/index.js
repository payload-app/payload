import React from 'react'
import { Switch, Route } from 'react-router'
import {
  listRoute,
  runRoute,
  baseRoute,
  authRoute,
  initRoute,
} from '../Routing'
import ProtectedRoute from './ProtectedRoute'
import Auth from '../PageAuth'
import List from '../PageList'
import Loading from '../PageLoading'
import Run from '../PageRun'

export default () => (
  <Switch>
    <ProtectedRoute exact path={baseRoute()} component={Loading} />
    <ProtectedRoute path={initRoute()} component={Loading} />
    <Route path={runRoute()} component={Run} />
    <ProtectedRoute path={listRoute()} component={List} />
    <Route path={authRoute()} component={Auth} />
  </Switch>
)
