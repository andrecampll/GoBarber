import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn/Index';
import SignUp from '../pages/SignUp/Index';
import Profile from '../pages/Profile/Index';
import ForgotPassword from '../pages/ForgotPassword/Index';
import ResetPassword from '../pages/ResetPassword/Index';

import Dashboard from '../pages/Dashboard/';

const Routes: React.FC = () => (
  <Switch>
    <Route exact path="/" component={SignIn} />
    <Route path="/signup" component={SignUp} />
    <Route path="/forgot-password" component={ForgotPassword} />
    <Route path="/reset_password" component={ResetPassword} />

    <Route path="/dashboard" component={Dashboard} isPrivate/>
    <Route path="/profile" component={Profile} isPrivate/>
  </Switch>
);

export default Routes;