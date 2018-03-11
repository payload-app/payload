import React from 'react'
import { Switch, Route } from 'react-router'
import {
  listRoute,
  runRoute,
  baseRoute,
  authRoute,
  initRoute,
  ownerSettingsRoute,
} from '../Routing'
import Auth from '../PageAuth'
import List from '../PageList'
import Loading from '../PageLoading'
import Run from '../PageRun'
import Settings from '../PageSettings'

export default () => (
  <Switch>
    <Route exact path={baseRoute()} component={Loading} />
    <Route path={initRoute()} component={Loading} />
    <Route path={runRoute()} component={Run} />
    <Route path={ownerSettingsRoute()} component={Settings} />
    <Route path={listRoute()} component={List} />
    <Route path={authRoute()} component={Auth} />
  </Switch>
)
