import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import classes from './style.module.scss';

const SubHeadTitle = ({ textId, text, className }) => <div className={classNames(classes.text, className)}>{text}</div>;

SubHeadTitle.propTypes = {
  textId: PropTypes.string,
  text: PropTypes.string,
  className: PropTypes.string,
};
export default SubHeadTitle;
