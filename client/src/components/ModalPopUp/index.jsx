import PropTypes from 'prop-types';
import { Dialog } from '@mui/material';

import classNames from 'classnames';
import classes from './style.module.scss';

const ModalPopUp = ({ height, open, className, onClose, children }) => (
  <Dialog
    sx={{
      height: '100vh',
      width: '100%',
      '& .MuiDialog-paper': {
        height,
        width: 'fit-content',
        boxSizing: 'border-box',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '.5rem',
      },
    }}
    open={open}
    onClose={onClose}
    PaperProps={{ className: classNames(classes.dialogWrapper, className) }}
  >
    {children}
  </Dialog>
);

ModalPopUp.propTypes = {
  children: PropTypes.element,
  open: PropTypes.bool,
  className: PropTypes.string,
  height: PropTypes.string,
  onClose: PropTypes.func,
};
export default ModalPopUp;
