import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Dialog } from '@mui/material';

import classes from './style.module.scss';

// eslint-disable-next-line arrow-body-style
const PopupMessage = ({ open, title, message, onClose, onOk }) => {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ className: classes.dialogWrapper }}>
      <div className={classes.title}>
        <FormattedMessage id={title || 'app_popup_error_title'} />
      </div>
      <div className={classes.message}>
        <FormattedMessage id={message || 'app_popup_error_message'} />
      </div>
      <div className={classes.wrapperBtn}>
        <button type="button" onClick={onClose} className={classes.button} aria-label="cancel">
          <FormattedMessage id="app_popup_close_button_label" />
        </button>
        {onOk ? (
          <button type="button" onClick={onOk} className={classes.button} aria-label="oke">
            <FormattedMessage id="app_popup_ok_button_label" />
          </button>
        ) : null}
      </div>
    </Dialog>
  );
};

PopupMessage.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  onOk: PropTypes.func,
};

export default PopupMessage;
