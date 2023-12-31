import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { selectCabins } from '@pages/CabinList/selectors';
import { getAllCabin } from '@pages/CabinList/actions';

import classes from './style.module.scss';

const CabinList = ({ cabins }) => {
  console.log(cabins);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllCabin());
  }, [dispatch]);

  return (
    <div className={classes.wrapper}>
      <FormattedMessage id="app_component_button_title_room_details" />
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  cabins: selectCabins,
});
CabinList.propTypes = {
  cabins: PropTypes.object,
};

export default connect(mapStateToProps)(CabinList);
