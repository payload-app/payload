import React from 'react'
import { Switch, Route } from 'react-router'
import ProtectedRoute from './ProtectedRoute'
import Auth from './Auth'
import List from './List'
import Loading from './Loading'

export default () => (
  <Switch>
    <ProtectedRoute exact path="/" component={Loading} />
    <ProtectedRoute
      path="/repos/ownertype/:ownerType/ownerid/:ownerId/"
      component={List}
    />
    <Route path="/auth" component={Auth} />
  </Switch>
)
