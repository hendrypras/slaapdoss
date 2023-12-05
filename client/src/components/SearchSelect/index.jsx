import PropTypes from 'prop-types';
import { LocationOn as LocationOnIcon, KeyboardArrowDown } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import classes from './style.module.scss';

const SearchSelect = ({ className, title, placeHolder, value, ...rest }) => (
  <button type="button" className={classNames(classes.wrapper, className)} {...rest}>
    <div className={classes.locationTitle}>
      <FormattedMessage id={title} />
    </div>
    <div className={classes.wrapperValue}>
      <div className={classes.wrapperLeft}>
        <LocationOnIcon className={classes.iconLocation} />
        <div className={classNames({ [classes.placeHolder]: true, [classes.value]: value || false })}>
          {value || <FormattedMessage id={placeHolder} />}
        </div>
      </div>
      <KeyboardArrowDown className={classes.iconArrow} />
    </div>
  </button>
);
SearchSelect.propTypes = {
  value: PropTypes.string,
  placeHolder: PropTypes.string.isRequired,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  rest: PropTypes.object,
};
export default SearchSelect;
