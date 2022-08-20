import * as React from 'react';
import { useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { joinTheEventHandler } from '../pages/abi/User/joinTheEvent';

export default function ScrollDialog(props: any) {
  const [open, setOpen] = React.useState(false);

  const handleJoin = async () => {
    try {
      const res = await joinTheEventHandler(props.contract);
      handleClose(true);
    } catch (e) {
      console.log(e);
      handleClose(false);
    }
  };

  const handleClose = (result: boolean) => {
    setOpen(false);
    props.onClick({ dialogOpen: false, success: result });
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    console.log('here');
    if (props.dialogOpen) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
      setOpen(true);
    }
  }, [props.dialogOpen]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll='paper'
        aria-labelledby='scroll-dialog-title'
        aria-describedby='scroll-dialog-description'>
        <DialogTitle id='scroll-dialog-title'>Confirm</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText
            id='scroll-dialog-description'
            ref={descriptionElementRef}
            tabIndex={-1}>
            Are you sure you want to join this event?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose(false);
            }}>
            Cancel
          </Button>
          <Button onClick={handleJoin}>Join</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
