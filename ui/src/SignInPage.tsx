import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { GoogleLoginButton } from 'react-social-login-buttons';

import firebase from './utils/firebase';

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
  social: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}));

const SignInPage: React.FC = () => {
  const classes = useStyles();

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => console.log(user));
  }, []);

  const handleGoogleSignup = React.useCallback(async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
      const currentUser = await firebase.auth().currentUser;
      const res = currentUser
        ? await currentUser.linkWithPopup(provider)
        : await firebase.auth().signInWithPopup(provider);
      console.log('C');

      console.log('res: ', res);
    } catch (err) {
      console.log('err: ', err);
    }
  }, []);

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
            <GoogleLoginButton className={classes.google} onClick={handleGoogleSignup} />
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default SignInPage;
