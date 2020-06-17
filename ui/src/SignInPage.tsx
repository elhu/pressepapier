import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';

import { Avatar, Container, Grid, Typography } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';

import { GoogleLoginButton } from 'react-social-login-buttons';

import firebase from './utils/firebase';
import { ROUTE_HOME } from './const';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  google: {
    width: '100% !important',
    margin: '0 !important',
  },
  signOut: {
    margin: theme.spacing(3, 0, 2),
  },
  social: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}));

const SignInPage: React.FC<RouteComponentProps> = (props) => {
  const classes = useStyles();

  const handleGoogleSignup = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
      const u = await firebase.auth().currentUser;
      u ? await u.linkWithPopup(provider) : await firebase.auth().signInWithPopup(provider);
      props.history.push(ROUTE_HOME);
    } catch (err) {
      console.log('err: ', err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Sign in or register
        </Typography>

        <Grid container className={classes.social}>
          <Grid item xs={12}>
            <GoogleLoginButton className={classes.google} onClick={handleGoogleSignup} text="Sign in with Google" />
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default withRouter(SignInPage);
