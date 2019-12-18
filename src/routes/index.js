import React from 'react';
import { Switch, Route } from 'react-router-dom';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';

export default function Routes() {
  return (
    <Switch>
      <Route patgh="/" exact component={SignIn} />
      <Route patgh="/register" component={SignUp} />
      <Route patgh="/dashboard" component={Dashboard} />
      <Route patgh="/profile" component={Profile} />
    </Switch>
  );
}
