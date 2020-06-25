import React, { MouseEvent, useCallback } from 'react';
import { Redirect } from 'react-router-dom';

import { Grid, Button, Container, makeStyles, Typography, Modal, Backdrop, Fade, TextField, Card, CardContent, CardActions, Tooltip } from '@material-ui/core';
import CopyToClipboard from 'react-copy-to-clipboard';

import { ROUTE_HOME } from './const';

import { loggedIn } from './utils/session';
import api from './api';

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
    // width: '50vw',
    // height: '50vh',
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
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    cursor: 'pointer',
  },
  clipboards: {
    marginTop: theme.spacing(4),
  },
}));

interface IProps {
  currentUser: firebase.User | null;
}

interface Clipboard {
  data: string,
  id: number,
}

const ClipboardsPage: React.FC<IProps> = (props: IProps) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const initClipboards: Clipboard[] = [];
  const [clipboards, setClipboards] = React.useState(initClipboards);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const setApiToken = useCallback(async (user: firebase.User) => {
    const idToken = await user.getIdToken()
    if (!idToken) {
      console.warn('[Firebase error]: idToken is not provided')
      return
    }
    api.setToken(idToken)
  }, []);

  React.useEffect(() => {
    const getAllClipboards = async () => {
      if (props.currentUser) {
        await setApiToken(props?.currentUser);
        setClipboards((await api.get<Clipboard[]>("/clipboards")).data)
      }
    }
    getAllClipboards()
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

  const handleCopyClipboard = (e: MouseEvent<HTMLElement>) => {
  }

  const handleDeleteClipboard = (targetClipboard: Clipboard, e: MouseEvent<HTMLElement>) => {
    const idx = clipboards.findIndex((c) => c.id === targetClipboard.id)
    setClipboards(Array.prototype.concat(clipboards.slice(0, idx), clipboards.slice(idx + 1)))
    e.stopPropagation();
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newClipboard: Clipboard = {
      data: e.currentTarget.value,
      id: clipboards.length,
    }
    setClipboards([newClipboard].concat(clipboards));
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
          <Grid item xs={6} key={c.id} onClick={handleCopyClipboard}>
            <CopyToClipboard text={c.data}>
              <Tooltip title="Clip to copy">
                <Card className={classes.paper}>
                  <CardContent>
                    <Typography component="p" variant="body1">
                      {c.data}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={(e: MouseEvent<HTMLElement>) => handleDeleteClipboard(c, e)}>Delete</Button>
                  </CardActions>
                </Card>
              </Tooltip>
            </CopyToClipboard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ClipboardsPage;
