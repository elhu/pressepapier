import React, { MouseEvent } from 'react';
import { Redirect } from 'react-router-dom';

import { Grid, Container, makeStyles, Snackbar, Paper, LinearProgress } from '@material-ui/core';

import { ROUTE_HOME } from './const';

import { loggedIn } from './utils/session';
import api from './api';
import Clipboard from './Clipboard';
import AddClipboard from './AddClipboard';

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

export interface IClipboard {
  data: string;
  id: number;
  hasFile: boolean;
  addPending?: boolean;
  deletePending?: boolean;
}

const ClipboardsPage: React.FC = () => {
  const classes = useStyles();
  const [erroring, setErroring] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const initClipboards: IClipboard[] = [];
  const [clipboards, setClipboards] = React.useState(initClipboards);

  const handleNetworkError = () => {
    setErroring(true);
  };

  React.useEffect(() => {
    const getAllClipboards = async () => {
      setLoading(true);
      api
        .get<IClipboard[]>('/clipboards')
        .then((response) => {
          setClipboards(response.data);
        })
        .catch(handleNetworkError);
      setLoading(false);
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
  }, []);

  const handleDeleteClipboard = async (targetClipboard: IClipboard, e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setLoading(true);
    setClipboards(clipboards.map((c) => (c.id === targetClipboard.id ? { ...c, deletePending: true } : c)));
    api
      .del(`/clipboards/${targetClipboard.id}`)
      .then(() => {
        setClipboards(clipboards.filter((c) => c.id !== targetClipboard.id));
      })
      .catch(handleNetworkError);
    setLoading(false);
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
        return { data: c.data, id: c.id, hasFile: c.hasFile };
      }),
    );
  };

  const addClipboardFile = async (data: File) => {
    const tempID = -clipboards.length;
    const newClipboard: IClipboard = {
      data: 'New Image',
      id: tempID,
      addPending: true,
      hasFile: true,
    };
    setLoading(true);
    const newClipboardState = [newClipboard].concat(clipboards);
    setClipboards([newClipboard].concat(clipboards));
    const form = new FormData();
    form.append('file', data);
    api
      .postFile<IClipboard>('/clipboards/files', form)
      .then((response) => {
        const cp = response.data;
        setClipboards(newClipboardState.map((c) => (c.id === tempID ? cp : c)));
      })
      .catch(handleNetworkError);
    setLoading(false);
  };

  const addClipboard = async (data: string) => {
    const tempID = -clipboards.length;
    const newClipboard: IClipboard = {
      data: data,
      id: tempID,
      addPending: true,
      hasFile: false,
    };
    setLoading(true);
    const newClipboardState = [newClipboard].concat(clipboards);
    setClipboards([newClipboard].concat(clipboards));
    api
      .post<IClipboard>('/clipboards', { data: newClipboard.data })
      .then((response) => {
        const cp = response.data;
        setClipboards(newClipboardState.map((c) => (c.id === tempID ? cp : c)));
      })
      .catch(handleNetworkError);
    setLoading(false);
  };

  if (!loggedIn()) {
    return <Redirect to={ROUTE_HOME} />;
  }
  return (
    <React.Fragment>
      {loading && <LinearProgress />}
      <Container component="main" maxWidth="md" className={classes.main}>
        <AddClipboard onClipboardAdd={addClipboard} onClipboardFileAdd={addClipboardFile} />
        <Grid container spacing={3} className={classes.clipboards}>
          {clipboards.map((c) => (
            <Clipboard onNetworkError={handleNetworkError} clipboard={c} onDelete={handleDeleteClipboard} key={c.id} />
          ))}
        </Grid>
        <Snackbar open={erroring} autoHideDuration={6000} onClose={handleAlertClose}>
          <Paper elevation={6} className={classes.error}>
            Oops, something went wrong! Please try again later.
          </Paper>
        </Snackbar>
      </Container>
    </React.Fragment>
  );
};

export default ClipboardsPage;
