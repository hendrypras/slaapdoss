import classNames from 'classnames';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import Button from '@components/Button';
import HeadTitle from '@components/HeadTitle';

import { selectSearchValue } from '@pages/Home/selectors';

import classes from './style.module.scss';

const ContentRoomNumber = ({ rooms, searchValue }) => {
  const [dataRoom, setDataRoom] = useState(null);
  const navigate = useNavigate();

  const handleConfirmToPayment = () => {
    navigate(
      `/reservation/${dataRoom.slug}/${dataRoom.id}?dateStart=${searchValue.checkIn.value}&dateEnd=${searchValue.checkOut.value}&duration=${searchValue.duration.value}`
    );
  };
  return (
    <div className={classes.wrapper}>
      <HeadTitle title="Select Number Room" />
      <div className={classes.wrapperBtn}>
        {rooms?.map((val, i) => (
          <Button
            key={i}
            onClick={() => setDataRoom({ id: val?.id, slug: val?.cabins_slug })}
            text={val?.room_number?.toString()}
            className={classNames({
              [classes.btnRoomNumber]: true,
              [classes.selected]: dataRoom?.id === val?.id || false,
            })}
          />
        ))}
      </div>
      <Button disabled={!dataRoom} onClick={handleConfirmToPayment} text="Confirm" className={classes.btnConfirm} />
    </div>
  );
};
const mapStateToProps = createStructuredSelector({
  searchValue: selectSearchValue,
});
ContentRoomNumber.propTypes = {
  rooms: PropTypes.array,
  searchValue: PropTypes.object,
};
export default connect(mapStateToProps)(ContentRoomNumber);
