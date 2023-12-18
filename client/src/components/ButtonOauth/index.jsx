import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Google as GoogleIcon } from '@mui/icons-material';

import classes from './style.module.scss';

const ButtonOauth = ({ handleClick, loading }) => (
  <button disabled={loading} onClick={handleClick} type="button" aria-label="oauth" className={classes.googleBtn}>
    <GoogleIcon />
    <span className="ml-2">
      <FormattedMessage id="app_login_sign_in_with_google_text" />
    </span>
  </button>
);
ButtonOauth.propTypes = {
  handleClick: PropTypes.func,
  loading: PropTypes.bool,
};
export default ButtonOauth;
