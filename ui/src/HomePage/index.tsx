import * as React from 'react';

import { Container, Typography, makeStyles } from '@material-ui/core';
import logo from './hero.jpg';

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
    gridRow: '1/-1',
    margin: '-5px -5px -5px -5px',
  },
  heroTitle: {
    textAlign: 'center',
    gridColumn: '1/-1',
    gridRow: '1/-1',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  hero: {
    overflow: 'hidden',
    display: 'grid',
    height: '50vh',
    lineHeight: '4em',
  },
}));

const HomePage: React.FC = () => {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xl" className={classes.main}>
      <div className={classes.hero}>
        <div className={classes.heroBackground}></div>
        <div className={classes.heroTitle}>
          <Typography component="h1" variant="h1">
            Presse-Papier
          </Typography>
        </div>
      </div>
      <div>
        <Typography component="h2" variant="h5">
          Easily share your clipboard between your computer and your phone
        </Typography>
        <Typography component="p">No more email yourself links, Presse-Papier is here!</Typography>
      </div>
    </Container>
  );
};

export default HomePage;
