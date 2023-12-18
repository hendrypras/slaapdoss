import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import icon from '@static/images/not-found.svg';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';

import Button from '@components/Button';

import { selectAssets } from '@containers/App/selectors';

import classes from './style.module.scss';

const NotFound = ({ assets }) => {
  const navigate = useNavigate();
  return (
    <div className={classes.contentWrapper}>
      <img className={classes.image} src={assets?.images?.notfound || icon} alt="Not Found" />
      <div className={classes.title}>
        <FormattedMessage id="app_not_found" />
      </div>
      <Button className={classes.button} onClick={() => navigate('/')}>
        <FormattedMessage id="app_not_found_button_text" />
      </Button>
    </div>
  );
};
const mapStateToProps = createStructuredSelector({
  assets: selectAssets,
});

NotFound.propTypes = {
  assets: PropTypes.object,
};

export default connect(mapStateToProps)(NotFound);
