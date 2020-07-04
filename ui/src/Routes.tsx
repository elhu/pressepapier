import React from 'react';
import { Switch, Route, useLocation, withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

import { LinearProgress } from '@material-ui/core';

import Header from './Header';
import HomePage from './HomePage';
import SignInPage from './SignInPage';
import ClipboardsPage from './ClipboardsPage';
import { ROUTE_CLIPBOARDS, ROUTE_HOME, ROUTE_SIGN_IN } from './const';

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
        <Route path={ROUTE_CLIPBOARDS}>{props.currentUser ? <ClipboardsPage /> : <LinearProgress />}</Route>
        <Route path={ROUTE_HOME} exact>
          <HomePage {...props} />
        </Route>
      </Switch>
    </React.Fragment>
  );
};

export default withRouter(Routes);
