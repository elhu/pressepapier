import React, { MouseEvent } from 'react';

import { Grid, Button, makeStyles, Typography, Card, CardContent, CardActions, Tooltip } from '@material-ui/core';
import CopyToClipboard from 'react-copy-to-clipboard';
import { IClipboard } from './ClipboardsPage';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    cursor: 'pointer',
  },
}));

interface IProps {
  clipboard: IClipboard;
  onDelete: (c: IClipboard, e: MouseEvent<HTMLElement>) => void;
}

const Clipboard: React.FC<IProps> = (props: IProps) => {
  const classes = useStyles();

  return (
    <Grid item xs={6} key={props.clipboard.id}>
      <CopyToClipboard text={props.clipboard.data}>
        <Tooltip title="Clip to copy">
          <Card className={classes.paper}>
            <CardContent>
              <Typography component="p" variant="body1">
                {props.clipboard.data}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={(e: MouseEvent<HTMLElement>) => props.onDelete(props.clipboard, e)}>
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
