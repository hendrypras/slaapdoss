import PropTypes from 'prop-types';
import classNames from 'classnames';
import classes from './style.module.scss';

const Container = ({ children, className, ...rest }) => (
  <div className={classes.container}>
    <div className={classNames(classes.wrapper, className)} {...rest}>
      {children}
    </div>
  </div>
);
Container.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
};
export default Container;
