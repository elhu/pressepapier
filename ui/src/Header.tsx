import React from 'react';
import { NavLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Link, Toolbar, Typography } from '@material-ui/core';

import { ROUTE_HOME } from './const';
import firebase from './utils/firebase';
import UserMenu from './UserMenu';

const useStyles = makeStyles((theme) => ({
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  toolbarTitleText: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
  toolbarLink: {
    color: theme.palette.text.primary,
  },
}));

interface IProps {
  currentUser: firebase.User | null;
}

const Header: React.FC<IProps> = (props: IProps) => {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
          <Link component={NavLink} to={ROUTE_HOME} className={classes.toolbarTitleText}>
            Presse-Papier
          </Link>
        </Typography>
        <UserMenu {...props} />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
