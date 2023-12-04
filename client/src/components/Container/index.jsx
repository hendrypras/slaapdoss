import PropTypes from 'prop-types';

import classes from './style.module.scss';

const Container = ({ children, className, ...rest }) => (
  <div className={classes.container}>
    <div className={className || classes.wrapper} {...rest}>
      {children}
    </div>
  </div>
);
Container.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
};
export default Container;
