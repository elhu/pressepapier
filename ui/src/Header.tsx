import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Avatar, IconButton, Link, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';

import { ROUTE_HOME, ROUTE_SIGN_IN } from './const';
import firebase from './utils/firebase';

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

interface IProps extends RouteComponentProps {
  currentUser: firebase.User | null;
}

const Header: React.FC<IProps> = (props: IProps) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleSignIn = () => {
    setAnchorEl(null);
    props.history.push(ROUTE_SIGN_IN);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSignOut = async () => {
    firebase.auth().signOut();
  };

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
          <Link component={NavLink} to={ROUTE_HOME} className={classes.toolbarTitleText}>
            Presse-Papier
          </Link>
        </Typography>
        <div>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            {props.currentUser && props.currentUser.photoURL ? (
              <Avatar>
                <img src={props.currentUser.photoURL} alt="user avatar" referrerPolicy="no-referrer" />
              </Avatar>
            ) : (
              <AccountCircle />
            )}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
          >
            {props.currentUser ? (
              <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
            ) : (
              <MenuItem onClick={handleSignIn}>Sign in/Register</MenuItem>
            )}
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(Header);
