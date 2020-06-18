import * as React from 'react';

import { Avatar, Container, Grid, Typography } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';

import SignInButton from './SignInButton';

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

const SignInPage: React.FC = () => {
  const classes = useStyles();

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
            <SignInButton className={classes.google} text="Sign in with Google" />
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default SignInPage;
