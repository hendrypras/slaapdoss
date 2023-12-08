import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import classes from './style.module.scss';

const HeadTitle = ({ titleId, className }) => (
  <div className={classNames(classes.text, className)}>
    <FormattedMessage id={titleId} />
  </div>
);

HeadTitle.propTypes = {
  titleId: PropTypes.string.isRequired,
  className: PropTypes.string,
};
export default HeadTitle;
