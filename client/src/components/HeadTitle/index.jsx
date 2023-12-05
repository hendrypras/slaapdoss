import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import classes from './style.module.scss';

const HeadTitle = ({ titleId }) => (
  <div className={classes.text}>
    <FormattedMessage id={titleId} />
  </div>
);

HeadTitle.propTypes = {
  titleId: PropTypes.string.isRequired,
};
export default HeadTitle;
