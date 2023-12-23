import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useMediaQuery } from '@mui/material';

import classes from './style.module.scss';

const HeadTitle = ({ children, title, className, size = 15 }) => {
  const isLg = useMediaQuery('(min-width:992px)');
  const isMd = useMediaQuery('(min-width:768px)');

  let adjustedSize = size;

  if (isMd) {
    adjustedSize += 2.5;
  }

  if (isLg) {
    adjustedSize += 5;
  }

  const textStyle = {
    fontSize: `${adjustedSize}px`,
  };

  return (
    <div data-testid="head-title" className={classNames(classes.text, className)} style={textStyle}>
      {title || children}
    </div>
  );
};

HeadTitle.propTypes = {
  title: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  children: PropTypes.element,
  className: PropTypes.string,
};

export default HeadTitle;
