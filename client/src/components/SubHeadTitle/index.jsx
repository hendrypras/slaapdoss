import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useMediaQuery } from '@mui/material';

import classes from './style.module.scss';

const SubHeadTitle = ({ children, title, className, mt = 10, size = 12 }) => {
  const isLg = useMediaQuery('(min-width:992px)');
  const isMd = useMediaQuery('(min-width:768px)');

  let adjustedSize = size;

  if (isMd) {
    adjustedSize += 1.6;
  }

  if (isLg) {
    adjustedSize += 2.8;
  }

  const textStyle = {
    fontSize: `${adjustedSize}px`,
    marginTop: `${mt}px`,
  };

  return (
    <div data-testid="sub-head-title" className={classNames(classes.text, className)} style={textStyle}>
      {title || children}
    </div>
  );
};

SubHeadTitle.propTypes = {
  title: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  mt: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  children: PropTypes.element,
  className: PropTypes.string,
};

export default SubHeadTitle;
