import React from 'react';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

import { Avatar, IconButton, Menu, MenuItem } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';

import { ROUTE_HOME } from './const';
import firebase from './utils/firebase';

interface IProps extends RouteComponentProps {
  currentUser: firebase.User | null;
}

const Header: React.FC<IProps> = (props: IProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleSignIn = () => {
    setAnchorEl(null);
    props.history.push(ROUTE_HOME);
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
    <div>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        {props.currentUser?.photoURL ? (
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
  );
};

export default withRouter(Header);
