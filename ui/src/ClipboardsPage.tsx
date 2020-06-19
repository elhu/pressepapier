import React from 'react';
import { Redirect } from 'react-router-dom';

import { Grid, Container, makeStyles, Typography, Modal, Backdrop, Fade, TextField, Paper } from '@material-ui/core';

import { ROUTE_HOME } from './const';

import { loggedIn } from './utils/session';

const useStyles = makeStyles((theme) => ({
  main: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  clipboard: {
    backgroundColor: 'grey',
    width: '100%',
    marginTop: theme.spacing(4),
    height: '15vh',
    overflow: 'hidden',
  },
  addClipboard: {
    backgroundColor: 'grey',
    width: '100%',
    textAlign: 'center',
    cursor: 'pointer',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dumpZone: {
    backgroundColor: 'white',
    marginBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  clipboards: {
    marginTop: theme.spacing(4),
  },
}));

interface IProps {
  currentUser: firebase.User | null;
}

const ClipboardsPage: React.FC<IProps> = (props: IProps) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const initClipboards: string[] = [];
  const [clipboards, setClipboards] = React.useState(initClipboards);

  React.useEffect(() => {
    setClipboards(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddClipboard = () => {
    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log('clibpoard', e.currentTarget.value);
    setOpen(false);
  };

  if (!loggedIn()) {
    return <Redirect to={ROUTE_HOME} />;
  }
  return (
    <Container component="main" maxWidth="md" className={classes.main}>
      <Container component="div" className={classes.addClipboard}>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <TextField
              className={classes.dumpZone}
              placeholder="Paste here"
              multiline
              rows={2}
              value=""
              onChange={handleChange}
            />
          </Fade>
        </Modal>
        <Typography component="h1" variant="h1" onClick={handleAddClipboard}>
          +
        </Typography>
      </Container>
      <Grid container spacing={3} className={classes.clipboards}>
        {clipboards.map((c) => (
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <Typography component="p" variant="body1">
                {c}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ClipboardsPage;
