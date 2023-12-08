import PropTypes from 'prop-types';
import { KeyboardArrowDown } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import classes from './style.module.scss';

const SearchSelect = ({ className, title, placeHolder, icon: IconComponent, value, handleClick, disabled }) => (
  <div className={classNames(classes.wrapper, className)}>
    <div className={classes.locationTitle}>
      <FormattedMessage id={title} />
    </div>
    <button
      disabled={disabled}
      type="button"
      onClick={handleClick}
      aria-label="button-select"
      className={classNames({ [classes.btnValue]: true, [classes.disBtnValue]: disabled || false })}
    >
      <div className={classes.wrapperLeft}>
        {IconComponent && <IconComponent className={classes.iconLocation} />}
        <div className={classNames({ [classes.placeHolder]: true, [classes.value]: value || false })}>
          {value || <FormattedMessage id={placeHolder} />}
        </div>
      </div>
      {!disabled && <KeyboardArrowDown className={classes.iconArrow} />}
    </button>
  </div>
);
SearchSelect.propTypes = {
  value: PropTypes.string,
  placeHolder: PropTypes.string.isRequired,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  handleClick: PropTypes.func,
  icon: PropTypes.elementType,
  disabled: PropTypes.bool,
};
export default SearchSelect;
