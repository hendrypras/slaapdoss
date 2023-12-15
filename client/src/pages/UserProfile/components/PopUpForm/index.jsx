import { Dialog } from '@mui/material';
import PropTypes from 'prop-types';

import IdCard from '@pages/UserProfile/components/IdCard';

import classes from './style.module.scss';

const PopUpForm = ({ open, onClose, dataIdCard, dataUser, loadingGlobal }) => (
  <Dialog open={open} onClose={onClose} PaperProps={{ className: classes.dialogWrapper }}>
    <IdCard dataIdCard={dataIdCard} dataUser={dataUser} loading={loadingGlobal} />
  </Dialog>
);

PopUpForm.propTypes = {
  dataIdCard: PropTypes.object,
  dataUser: PropTypes.object,
  loadingGlobal: PropTypes.bool,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
export default PopUpForm;
