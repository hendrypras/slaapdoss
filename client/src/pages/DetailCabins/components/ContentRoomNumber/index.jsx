import classNames from 'classnames';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Button from '@components/Button';
import HeadTitle from '@components/HeadTitle';

import { selectRoomId } from '@pages/DetailCabins/selectors';

import { setRoomSelected } from '@pages/DetailCabins/actions';
import classes from './style.module.scss';

const ContentRoomNumber = ({ rooms, roomId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSetRoomId = (id) => {
    dispatch(setRoomSelected(id));
  };
  const handleConfirmToPayment = () => {
    navigate(`/reservation/${roomId}`);
  };
  return (
    <div className={classes.wrapper}>
      <HeadTitle title="Select Number Room" />
      <div className={classes.wrapperBtn}>
        {rooms?.map((val, i) => (
          <Button
            key={i}
            onClick={() => handleSetRoomId(val?.id)}
            text={val?.room_number?.toString()}
            className={classNames({
              [classes.btnRoomNumber]: true,
              [classes.selected]: roomId === val?.id || false,
            })}
          />
        ))}
      </div>
      <Button disabled={!roomId} onClick={handleConfirmToPayment} text="Confirm" className={classes.btnConfirm} />
    </div>
  );
};
const mapStateToProps = createStructuredSelector({
  roomId: selectRoomId,
});

ContentRoomNumber.propTypes = {
  rooms: PropTypes.array,
  roomId: PropTypes.number,
};
export default connect(mapStateToProps)(ContentRoomNumber);
