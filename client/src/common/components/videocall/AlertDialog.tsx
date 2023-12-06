import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useStore } from '../../../stores/stores';
import { useEffect, useState } from 'react';


// AlertDialog dat tai ChatHome
export default function AlertDialog() {
  const { commonStore: { setOpenDialog, cuocGoiTuUser, setOpenCuocGoiDen } } = useStore()
  const [timer, setTimer] = useState(0);
  let interval: any;

  const handleClose = (event: any, reason: any) => {
    if (reason && reason === "backdropClick" && "escapeKeyDown")
      return;
    setOpenDialog(false);
  };

  const handleDisagree = () => {
    setOpenDialog(false)
  }

  const handleAgree = () => {    
    setOpenCuocGoiDen(true)
    setOpenDialog(false)
  }

  useEffect(() => {    
    // ring in 27s ringtone.mp3
    if (timer <= 5) {
      interval = setInterval(() => {
        setTimer((prev)=>prev+1);
      }, 1000);
    }else{      
      setOpenDialog(false)
    }

    return () => {
      console.log('Huy dialog')    
      clearInterval(interval)  
    };
  }, [timer, setOpenDialog]);

  return (
    <>
      <audio src='./assets/audio/ringtone.mp3' autoPlay></audio>
      <Dialog
        open={true}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Call from {cuocGoiTuUser?.displayName}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Lick Agree to accept video call
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDisagree} color='error'>Disagree</Button>
          <Button onClick={handleAgree} autoFocus color='success'>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}