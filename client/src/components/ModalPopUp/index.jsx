import PropTypes from 'prop-types';
import { Dialog } from '@mui/material';

import classNames from 'classnames';
import classes from './style.module.scss';

const ModalPopUp = ({ open, className, onClose, children }) => (
  <Dialog open={open} onClose={onClose} PaperProps={{ className: classNames(classes.dialogWrapper, className) }}>
    {children}
  </Dialog>
);

ModalPopUp.propTypes = {
  children: PropTypes.element,
  open: PropTypes.bool,
  className: PropTypes.string,
  onClose: PropTypes.func,
};
export default ModalPopUp;
