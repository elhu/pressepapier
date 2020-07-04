import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

import { LinearProgress } from '@material-ui/core';

import Header from './Header';
import HomePage from './HomePage';
import ClipboardsPage from './ClipboardsPage';
import { ROUTE_CLIPBOARDS, ROUTE_HOME } from './const';
import { loggedIn } from './utils/session';

interface IProps extends RouteComponentProps {
  currentUser: firebase.User | null;
}

const Routes: React.FC<IProps> = (props) => {
  return (
    <React.Fragment>
      <Switch>
        {loggedIn() && (
          <Route path={ROUTE_CLIPBOARDS}>
            <Header currentUser={props.currentUser} />
            {props.currentUser ? <ClipboardsPage /> : <LinearProgress />}
          </Route>
        )}
        <Route path={ROUTE_HOME} exact>
          <HomePage {...props} />
        </Route>
        <Route>
          <Redirect to={loggedIn() ? ROUTE_CLIPBOARDS : ROUTE_HOME} />
        </Route>
      </Switch>
    </React.Fragment>
  );
};

export default withRouter(Routes);
