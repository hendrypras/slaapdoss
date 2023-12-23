import PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';

const SnackBar = ({ open, handleClose, message }) => (
  <Snackbar autoHideDuration={2000} color="red" open={open} onClose={handleClose} message={message} />
);
SnackBar.propTypes = {
  open: PropTypes.bool,
  message: PropTypes.string,
  handleClose: PropTypes.func,
};
export default SnackBar;
