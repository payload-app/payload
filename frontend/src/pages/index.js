import React from 'react'

import { Switch, Route } from 'react-router-dom'
import Auth from './Auth'
import List from './List'

export const Routes = () => (
  <Switch>
    <Route exact path="/" component={List} />
    <Route path="/auth" component={Auth} />
  </Switch>
)

export default Routes
