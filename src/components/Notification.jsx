import { forwardRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { useNotificationContext } from '../contexts/notificationContext';

export default function Notification({ open, duration, variation, message }) {
  const notification = useNotificationContext();

  if (!open) return undefined;

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    notification.close();
  };

  return (
    <Snackbar open={open} autoHideDuration={duration} onClose={handleClose}>
      <Alert onClose={handleClose} severity={variation} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert {...props} ref={ref} elevation={6} variant="filled" />;
});
