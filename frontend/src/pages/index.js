import React from 'react'

import { Switch, Route } from 'react-router'
import Auth from './Auth'
import List from './List'
import Loading from './Loading'

export const Routes = () => (
  <Switch>
    <Route exact path="/" component={Loading} />
    <Route
      path="/repos/ownertype/:ownerType/ownerid/:ownerId/"
      component={List}
    />
    <Route path="/auth" component={Auth} />
  </Switch>
)

export default Routes
