import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { selectAssets } from '@containers/App/selectors';

import { setSearchValue } from '@pages/Home/actions';

import HeadTitle from '@components/HeadTitle';
import Button from '@components/Button';

import moment from 'moment';
import classes from './style.module.scss';

const ContentDuration = ({ searchValue, onClose, assets }) => {
  const dispatch = useDispatch();
  const handleSetSearchValue = (duration) => {
    const { location, checkIn } = searchValue;
    dispatch(
      setSearchValue(location, checkIn, duration, {
        display: moment(checkIn.value).add(duration.value, 'days').format('ddd, D MMMM YYYY'),
        value: moment(checkIn.value).add(duration.value, 'days').format('YYYY-MM-DD'),
      })
    );
    onClose();
  };

  return (
    <div className={classes.wrapper}>
      <HeadTitle className={classes.headTitle}>
        <FormattedMessage id="ap_home_component_title_list_duration" />
      </HeadTitle>
      <div className={classes.wrapperDuration}>
        {assets?.durationSearch?.map((val, i) => (
          <React.Fragment key={i}>
            <Button
              className={classNames({
                [classes.names]: true,
                [classes.selected]: val?.value === searchValue?.duration?.value || false,
              })}
              to="/"
              title={val.display}
              onClick={() => handleSetSearchValue({ display: val.display, value: val.value })}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
const mapStateToProps = createStructuredSelector({
  assets: selectAssets,
});

ContentDuration.propTypes = {
  searchValue: PropTypes.object,
  onClose: PropTypes.func,
  assets: PropTypes.object,
};
export default connect(mapStateToProps)(ContentDuration);
