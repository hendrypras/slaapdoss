import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import classes from './style.module.scss';

/* eslint-disable react/button-has-type */
const Button = ({ text, className, type, isLoading, ...rest }) => (
  <button
    disabled={isLoading}
    className={classNames({ [classes.wrapper]: true, [classes.disabledBtn]: isLoading || false }, className)}
    type={type || 'button'}
    {...rest}
  >
    <FormattedMessage id={text} />
  </button>
);

Button.propTypes = {
  text: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  rest: PropTypes.object,
  isLoading: PropTypes.bool,
};
export default Button;
