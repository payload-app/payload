import React from 'react'
import { Switch, Route } from 'react-router'
import { listRoute, runRoute, baseRoute, authRoute } from '../Routing'
import ProtectedRoute from './ProtectedRoute'
import Auth from '../PageAuth'
import List from '../PageList'
import Loading from '../PageLoading'
import Run from '../PageRun'

// TODO: impelement routing scheme
// :type/:ownerType/:ownerName/:repoName/:sha
// github/organization/payload-app/org-webhook-tester/D5293EF1B027E68B60
//                     ^selector  ^ repo run details ^ one run
export default () => (
  <Switch>
    <ProtectedRoute exact path={baseRoute()} component={Loading} />
    <ProtectedRoute path={listRoute()} component={List} />
    <Route path={runRoute()} component={Run} />
    <Route path={authRoute()} component={Auth} />
  </Switch>
)
