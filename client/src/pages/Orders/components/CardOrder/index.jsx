import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  RoomOutlined as RoomOutlinedIcon,
  Class as ClassIcon,
  AccessAlarm as AccessAlarmIcon,
  RequestQuoteOutlined as RequestQuoteOutlinedIcon,
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';

import HeadTitle from '@components/HeadTitle';
import SubHeadTitle from '@components/SubHeadTitle';
import Button from '@components/Button';
import formateDate from '@utils/formateDate';
import formatCurrency from '@utils/formatCurrency';

import classNames from 'classnames';
import classes from './style.module.scss';

const CardOrder = ({ orderDetail, cancelTransaction, loadingGlobal }) => {
  const navigate = useNavigate();

  const room = orderDetail?.room;
  const startReservation = formateDate(parseInt(orderDetail?.start_reservation, 10), 'DD MMM YYYY');
  const endReservation = formateDate(parseInt(orderDetail?.end_reservation, 10), 'DD MMM YYYY');
  const totalPrice = formatCurrency(Number(orderDetail?.total_price));
  let statusOrder = orderDetail?.response_payment?.transaction_status;
  if (orderDetail?.response_payment?.transaction_status === 'settlement') {
    statusOrder = 'Completed';
  }
  const handleContinuePayment = () => {
    navigate(`/payment/pending/${orderDetail?.order_id}`);
  };
  return (
    <div className={classes.card}>
      <div className={classes.wrapperHead}>
        <div className={classes.wrapperOrderId}>
          <div className={classes.titleOrderId}>Order ID:</div>
          <div className={classes.valueOrderId}>{orderDetail?.order_id}</div>
        </div>
        <div
          className={classNames({
            [classes.chip]: true,
            [classes.completed]: statusOrder === 'Completed' || false,
            [classes.cancel]: statusOrder === 'cancel' || false,
            [classes.expire]: statusOrder === 'expire' || false,
          })}
        >
          Status: {statusOrder}
        </div>
      </div>
      <div className={classes.wrapperContent}>
        <div className={classes.content}>
          <RoomOutlinedIcon className={classes.icon} />
          <div>
            <HeadTitle title={`${room?.cabin?.name}, ${room?.cabin?.city}`} size={16} />
            <SubHeadTitle mt={2} title={room?.cabin?.address} size={13} className={classes.address} />
          </div>
        </div>
        <div className={classes.content}>
          <ClassIcon className={classes.icon} />
          <div>
            <HeadTitle title={room?.type_room?.name} size={16} />
          </div>
        </div>
        <div className={classes.content}>
          <AccessAlarmIcon className={classes.icon} />
          <div>
            <HeadTitle title={`${orderDetail?.stay_duration} Night`} size={16} />
            <SubHeadTitle mt={2} size={12} title={`${startReservation} - ${endReservation}`} />
          </div>
        </div>
        <div className={classes.content}>
          <RequestQuoteOutlinedIcon className={classes.icon} />
          <div>
            <HeadTitle title={totalPrice} size={16} />
          </div>
        </div>
      </div>
      {statusOrder === 'pending' && (
        <>
          <div className={classes.textWaiting}>
            <FormattedMessage id="app_orders_waiting_for_payment_title" />
          </div>
          <div className={classes.wrapperBtnPending}>
            <Button onClick={handleContinuePayment} type="button">
              <FormattedMessage id="app_orders_text_button_continue_payment" />
            </Button>
            <Button
              type="button"
              disabled={loadingGlobal}
              className={classes.btnCancel}
              onClick={() => cancelTransaction(orderDetail?.order_id)}
            >
              <FormattedMessage id="app_orders_text_button_cancel_reservation" />
            </Button>
          </div>
        </>
      )}
      {statusOrder === 'Completed' && (
        <div className={classes.wrapperBtnSuccess}>
          <Button
            type="button"
            onClick={() => navigate(`/order/success/${orderDetail?.order_id}`)}
            className={classes.btnSuccess}
            title="Detail"
          />
        </div>
      )}
    </div>
  );
};

CardOrder.propTypes = {
  orderDetail: PropTypes.object,
  cancelTransaction: PropTypes.func,
  loadingGlobal: PropTypes.bool,
};

export default CardOrder;
