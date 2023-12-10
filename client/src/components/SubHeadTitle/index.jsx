import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import classes from './style.module.scss';

const SubHeadTitle = ({ textId, className }) => (
  <div className={classNames(classes.text, className)}>
    <FormattedMessage id={textId} />
  </div>
);

SubHeadTitle.propTypes = {
  textId: PropTypes.string.isRequired,
  className: PropTypes.string,
};
export default SubHeadTitle;
