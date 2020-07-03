import React, { MouseEvent, useCallback } from 'react';
import { Redirect } from 'react-router-dom';

import {
  Grid,
  Container,
  makeStyles,
  Typography,
  Modal,
  Backdrop,
  Fade,
  TextField,
  Snackbar,
  Paper,
} from '@material-ui/core';

import { ROUTE_HOME } from './const';

import { loggedIn } from './utils/session';
import api from './api';
import Clipboard from './Clipboard';

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
    backgroundColor: 'transparent',
    marginBottom: theme.spacing(4),
  },
  dumpZoneInput: {
    '&::placeholder': {
      color: 'white',
      opacity: '1',
      fontSize: '4rem',
      lineHeight: '4rem',
      textAlign: 'center',
    },
    caretColor: 'transparent',
    width: '50vw',
    height: '50vh',
  },
  clipboards: {
    marginTop: theme.spacing(4),
  },
  error: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.error.contrastText,
    padding: '1rem',
    fontWeight: theme.typography.fontWeightBold,
  },
}));

interface IProps {
  currentUser: firebase.User | null;
}

export interface IClipboard {
  data: string;
  id: number;
  addPending?: boolean;
  deletePending?: boolean;
}

const ClipboardsPage: React.FC<IProps> = (props: IProps) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [erroring, setErroring] = React.useState(false);
  const initClipboards: IClipboard[] = [];
  const [clipboards, setClipboards] = React.useState(initClipboards);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const setApiToken = useCallback(async (user: firebase.User) => {
    const idToken = await user.getIdToken();
    api.setToken(idToken);
  }, []);

  const handleNetworkError = () => {
    setErroring(true);
  };

  React.useEffect(() => {
    const getAllClipboards = async () => {
      if (props.currentUser) {
        await setApiToken(props.currentUser);
        api
          .get<IClipboard[]>('/clipboards')
          .then((response) => {
            setClipboards(response.data);
          })
          .catch(handleNetworkError);
      }
    };
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        await getAllClipboards();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    getAllClipboards();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [props, setApiToken]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddClipboard = () => {
    setOpen(true);
  };

  const handleModalRendered = () => {
    inputRef.current?.focus();
  };

  const handleDeleteClipboard = async (targetClipboard: IClipboard, e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setClipboards(clipboards.map((c) => (c.id === targetClipboard.id ? { ...c, deletePending: true } : c)));
    if (props.currentUser) {
      await setApiToken(props.currentUser);
      api
        .del(`/clipboards/${targetClipboard.id}`)
        .then(() => {
          setClipboards(clipboards.filter((c) => c.id !== targetClipboard.id));
        })
        .catch(handleNetworkError);
    }
  };

  const handleAlertClose = () => {
    setErroring(false);
    setClipboards(
      clipboards.flatMap((c) => {
        // Remove clipboards with failed inserts
        if (c.addPending) {
          return [];
        }
        // Clear up pending statuses
        return { data: c.data, id: c.id };
      }),
    );
  };

  const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const tempID = -clipboards.length;
    const newClipboard: IClipboard = {
      data: e.currentTarget.value,
      id: tempID,
      addPending: true,
    };
    const newClipboardState = [newClipboard].concat(clipboards);
    setClipboards([newClipboard].concat(clipboards));
    if (props.currentUser) {
      await setApiToken(props.currentUser);
      api
        .post<IClipboard>('/clipboards', { data: newClipboard.data })
        .then((response) => {
          const cp = response.data;
          setClipboards(newClipboardState.map((c) => (c.id === tempID ? cp : c)));
        })
        .catch(handleNetworkError);
    }
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
          onRendered={handleModalRendered}
        >
          <Fade in={open}>
            <TextField
              className={classes.dumpZone}
              placeholder="⌘+V"
              multiline
              rows={2}
              value=""
              onChange={handleChange}
              inputRef={inputRef}
              autoFocus
              InputProps={{
                classes: { input: classes.dumpZoneInput },
              }}
            />
          </Fade>
        </Modal>
        <Typography component="h1" variant="h1" onClick={handleAddClipboard}>
          +
        </Typography>
      </Container>
      <Grid container spacing={3} className={classes.clipboards}>
        {clipboards.map((c) => (
          <Clipboard clipboard={c} onDelete={handleDeleteClipboard} key={c.id} />
        ))}
      </Grid>
      <Snackbar open={erroring} autoHideDuration={6000} onClose={handleAlertClose}>
        <Paper elevation={6} className={classes.error}>
          Oops, something went wrong! Please try again later.
        </Paper>
      </Snackbar>
    </Container>
  );
};

export default ClipboardsPage;
