import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { FormattedMessage } from 'react-intl';

import classes from './style.module.scss';

const BackButton = ({ ...rest }) => (
  <button {...rest} className={classes.button} type="button" aria-label="back-btn">
    <KeyboardBackspaceIcon className={classes.icon} /> <FormattedMessage id="app_back_button_text" />
  </button>
);

export default BackButton;
