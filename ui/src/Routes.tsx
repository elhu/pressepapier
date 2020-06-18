import React from 'react';
import { Switch, Route } from 'react-router-dom';

import HomePage from './HomePage';
import SignInPage from './SignInPage';
import { ROUTE_SIGN_IN } from './const';
import { ROUTE_HOME } from './const';

interface IProps {
  currentUser: firebase.User | null;
}

const Routes: React.FC<IProps> = (props) => {
  return (
    <Switch>
      {!props.currentUser && (
        <Route path={ROUTE_SIGN_IN}>
          <SignInPage {...props} />
        </Route>
      )}
      <Route path={ROUTE_HOME}>
        <HomePage />
      </Route>
    </Switch>
  );
};

export default Routes;
