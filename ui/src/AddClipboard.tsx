import React from 'react';

import { Container, makeStyles, Typography, Modal, Backdrop, Fade, TextField } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
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
}));

interface IProps {
  onClipboardAdd: (value: string) => Promise<void>;
  onClipboardFileAdd: (value: File) => Promise<void>;
}

const AddClipboard: React.FC<IProps> = (props: IProps) => {
  const classes = useStyles();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const imageRef = React.useRef<HTMLImageElement>(null);
  const [open, setOpen] = React.useState(false);

  const handleModalRendered = () => {
    inputRef.current?.focus();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddClipboard = () => {
    setOpen(true);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOpen(false);
    await props.onClipboardAdd(e.currentTarget.value);
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    setOpen(false);
    if (e.clipboardData.items.length > 0) {
      const file = e.clipboardData.items[0].getAsFile();
      if (file?.type === 'image/png' && imageRef) {
        await props.onClipboardFileAdd(file);
      }
      // warn that only pngs are supported
    }
  };

  return (
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
            onPaste={handlePaste}
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
  );
};

export default AddClipboard;
