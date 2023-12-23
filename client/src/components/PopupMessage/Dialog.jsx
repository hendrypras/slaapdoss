import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { Dialog } from '@mui/material';

import classes from './style.module.scss';

// eslint-disable-next-line arrow-body-style
const PopupMessage = ({ open, title, message, titleId, messageId, onClose, onOk }) => {
  return (
    <Dialog data-testid="popup-message" open={open} onClose={onClose} PaperProps={{ className: classes.dialogWrapper }}>
      <div data-testid="titleId" className={classes.title}>
        {!title || titleId ? <FormattedMessage id={titleId || 'app_popup_error_title'} /> : title}
      </div>
      <div data-testid="messageId" className={classes.message}>
        {!message || messageId ? <FormattedMessage id={messageId || 'app_popup_error_message'} /> : message}
      </div>
      <div className={classes.wrapperBtn}>
        <button
          data-testid="button"
          type="button"
          onClick={onClose}
          className={classNames({ [classes.button]: true, [classes.nonActive]: onOk || false })}
          aria-label="cancel"
        >
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
  titleId: PropTypes.string,
  messageId: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  onOk: PropTypes.func,
};

export default PopupMessage;
