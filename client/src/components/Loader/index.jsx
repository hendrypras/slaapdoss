import classNames from 'classnames';
import PropTypes from 'prop-types';

import classes from './style.module.scss';

const LoaderDots = ({ isLoading }) => (
  <div
    data-testid="Loading"
    className={classNames({
      [classes.loaderComponent]: true,
      [classes.showLoader]: isLoading || false,
    })}
  >
    <div className={classes.loading}>
      <span className={classes.dot} />
      <span className={classes.dot} />
      <span className={classes.dot} />
    </div>
  </div>
);
LoaderDots.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
export default LoaderDots;
