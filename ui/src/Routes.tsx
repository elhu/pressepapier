import React from 'react';
import { Switch, Route, useLocation, withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

import Header from './Header';
import HomePage from './HomePage';
import SignInPage from './SignInPage';
import { ROUTE_HOME, ROUTE_SIGN_IN } from './const';

interface IProps extends RouteComponentProps {
  currentUser: firebase.User | null;
}

const Routes: React.FC<IProps> = (props) => {
  return (
    <React.Fragment>
      {useLocation().pathname !== ROUTE_HOME && <Header currentUser={props.currentUser} />}
      <Switch>
        {!props.currentUser && (
          <Route path={ROUTE_SIGN_IN}>
            <SignInPage {...props} />
          </Route>
        )}
        <Route path={ROUTE_HOME} exact>
          <HomePage />
        </Route>
      </Switch>
    </React.Fragment>
  );
};

export default withRouter(Routes);
