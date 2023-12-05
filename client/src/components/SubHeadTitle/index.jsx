import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import classes from './style.module.scss';

const SubHeadTitle = ({ textId }) => (
  <div className={classes.text}>
    <FormattedMessage id={textId} />
  </div>
);

SubHeadTitle.propTypes = {
  textId: PropTypes.string.isRequired,
};
export default SubHeadTitle;
