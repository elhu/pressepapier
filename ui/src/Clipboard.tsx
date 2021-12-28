import React, { MouseEvent } from 'react';

import { Grid, Button, makeStyles, Typography, Card, CardContent, CardActions, Tooltip } from '@material-ui/core';
import CopyToClipboard from 'react-copy-to-clipboard';
import { IClipboard } from './ClipboardsPage';
import api from './api';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    cursor: 'pointer',
  },
  pending: {
    filter: 'blur(1px)',
  },
  pendingActions: {
    visibility: 'hidden',
  },
}));

interface IProps {
  clipboard: IClipboard;
  onDelete: (c: IClipboard, e: MouseEvent<HTMLElement>) => void;
  onNetworkError: () => void;
}

const displayImage = async (setImageURL: React.Dispatch<React.SetStateAction<string>>, props: IProps) => {
  api
    .getBlob(`/clipboards/${props.clipboard.id}/files`)
    .then((response) => {
      const objectURL = URL.createObjectURL(new Blob([response.data]));
      setImageURL(objectURL);
    })
    .catch(props.onNetworkError);
};

const onDelete = async (props: IProps, objectURL: string, e: MouseEvent<HTMLElement>) => {
  props.onDelete(props.clipboard, e);
  if (objectURL !== '') {
    URL.revokeObjectURL(objectURL);
  }
};

const handleFileCopy = async (imageURL: string) => {
  if (imageURL !== '') {
    const file = await fetch(imageURL)
      .then((r: Response) => r.blob())
      .then((blobFile: Blob) => new File([blobFile], 'file.png', { type: 'image/png' }));
    const items = { [file.type]: file };
    const clipboardItem = new ClipboardItem(items);
    await navigator.clipboard.write([clipboardItem]);
  }
};

const Clipboard: React.FC<IProps> = (props: IProps) => {
  const classes = useStyles();
  const isPending = props.clipboard.addPending || props.clipboard.deletePending;
  const [imageURL, setImageURL] = React.useState('');
  React.useEffect(() => {
    if (props.clipboard.hasFile) {
      displayImage(setImageURL, props);
    }
  }, [props]);

  return (
    <Grid item xs={6}>
      <CopyToClipboard
        text={props.clipboard.data}
        onCopy={() => {
          handleFileCopy(imageURL);
        }}
      >
        <Tooltip title="Clip to copy">
          <Card className={`${classes.paper} ${isPending ? classes.pending : ''}`}>
            <CardContent>
              {props.clipboard.hasFile ? (
                <img src={imageURL} alt={`File for clipboard ${props.clipboard.id}`} />
              ) : (
                <Typography component="p" variant="body1">
                  {' '}
                  {props.clipboard.data}{' '}
                </Typography>
              )}
            </CardContent>
            <CardActions className={`${isPending ? classes.pendingActions : ''}`}>
              <Button size="small" onClick={(e: MouseEvent<HTMLElement>) => onDelete(props, imageURL, e)}>
                Delete
              </Button>
            </CardActions>
          </Card>
        </Tooltip>
      </CopyToClipboard>
    </Grid>
  );
};

export default Clipboard;
