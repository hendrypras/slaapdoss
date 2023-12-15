import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import classes from './style.module.scss';

/* eslint-disable react/button-has-type */
const Button = ({ text, title, disabled, className, type, children, onClick, isLoading, ...rest }) => (
  <button
    onClick={onClick}
    disabled={disabled || isLoading}
    className={classNames(
      { [classes.wrapper]: true, [classes.disabledBtn]: disabled || isLoading || false },
      className
    )}
    type={type || 'button'}
    {...rest}
  >
    {title || children || <FormattedMessage id={text} />}
  </button>
);

Button.propTypes = {
  text: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
  children: PropTypes.element,
  className: PropTypes.string,
  rest: PropTypes.object,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};
export default Button;
