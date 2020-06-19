import * as React from 'react';
import { Redirect } from 'react-router-dom';

import { Container, Typography, makeStyles } from '@material-ui/core';

import SignInButton from '../SignInButton';
import logo from './hero.jpg';

import { ROUTE_CLIPBOARDS } from '../const';
import { loggedIn } from '../utils/session';

const useStyles = makeStyles((theme) => ({
  main: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  heroBackground: {
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${logo})`,
    filter: 'blur(8px)',
    backgroundSize: 'cover',
    gridColumn: '1/-1',
    gridRow: '1/3',
    margin: '-15px -15px -100px -15px',
  },
  heroTitle: {
    textAlign: 'center',
    gridColumn: '1/-1',
    gridRow: '1/1',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    paddingTop: theme.spacing(8),
    textTransform: 'uppercase',
  },
  heroText: {
    color: 'white',
    gridColumn: '1/-1',
    gridRow: '2/2',
    zIndex: 2,
    textAlign: 'center',
    lignHeight: '4em',
  },
  hero: {
    overflow: 'hidden',
    display: 'grid',
    minHeight: '100vh',
    lineHeight: '4em',
    paddingBottom: theme.spacing(8),
    textShadow: 'rgb(0, 0, 0) 0px 1px 1px',
  },
  google: {
    marginTop: `${theme.spacing(8)}px !important`,
    width: 'auto !important',
    marginLeft: 'auto !important',
    marginRight: 'auto !important',
  },
}));

interface IProps {
  currentUser: firebase.User | null;
}

const HomePage: React.FC<IProps> = (props: IProps) => {
  const classes = useStyles();

  if (loggedIn()) {
    return <Redirect to={ROUTE_CLIPBOARDS} />;
  }
  return (
    <Container component="main" maxWidth={false} className={classes.main}>
      <div className={classes.hero}>
        <div className={classes.heroBackground}></div>
        <div className={classes.heroTitle}>
          <Typography component="h1" variant="h1">
            Presse-Papier
          </Typography>
        </div>
        <Container component="main" maxWidth="md" className={classes.heroText}>
          <Typography component="h2" variant="h5">
            Easily share your clipboard between your computer and your phone.
          </Typography>
          <Typography component="p">No more email yourself links, Presse-Papier is here!</Typography>
          <SignInButton className={classes.google} text="Register to get started" />
        </Container>
      </div>
    </Container>
  );
};

export default HomePage;
