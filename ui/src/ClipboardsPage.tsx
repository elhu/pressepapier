import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import { ROUTE_HOME } from './const';

const useStyles = makeStyles((theme) => ({}));

interface IProps {
  currentUser: firebase.User | null;
}

const ClipboardsPage: React.FC<IProps> = (props: IProps) => {
  const classes = useStyles();

  if (!props.currentUser) {
    return <Redirect to={ROUTE_HOME} />;
  }
  return <p>Clipboard page</p>;
};

export default ClipboardsPage;
