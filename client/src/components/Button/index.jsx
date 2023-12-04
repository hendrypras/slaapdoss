import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import classes from './style.module.scss';

/* eslint-disable react/button-has-type */
const Button = ({ text, type, rest, isLoading }) => (
  <button
    disabled={isLoading}
    className={classNames({ [classes.wrapper]: true, [classes.disabledBtn]: isLoading || false })}
    type={type || 'button'}
    {...rest}
  >
    <FormattedMessage id={text} />
  </button>
);

Button.propTypes = {
  text: PropTypes.string,
  type: PropTypes.string,
  rest: PropTypes.object,
  isLoading: PropTypes.bool,
};
export default Button;
