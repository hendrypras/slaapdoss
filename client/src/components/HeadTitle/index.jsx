import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import classes from './style.module.scss';

const HeadTitle = ({ titleId, title, className }) => (
  <div className={classNames(classes.text, className)}>{title || <FormattedMessage id={titleId} />}</div>
);

HeadTitle.propTypes = {
  titleId: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string,
};
export default HeadTitle;
