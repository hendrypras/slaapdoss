import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  RoomOutlined as RoomOutlinedIcon,
  Class as ClassIcon,
  AccessAlarm as AccessAlarmIcon,
  RequestQuoteOutlined as RequestQuoteOutlinedIcon,
} from '@mui/icons-material';

import HeadTitle from '@components/HeadTitle';
import SubHeadTitle from '@components/SubHeadTitle';
import Button from '@components/Button';

import formateDate from '@utils/formateDate';
import formatCurrency from '@utils/formatCurrency';

import classes from './style.module.scss';

const CardOrder = ({ orderDetail }) => {
  const room = orderDetail?.room;
  const startReservation = formateDate(parseInt(orderDetail?.start_reservation, 10), 'DD MMM YYYY');
  const endReservation = formateDate(parseInt(orderDetail?.end_reservation, 10), 'DD MMM YYYY');
  const totalPrice = formatCurrency(Number(orderDetail?.total_price));
  return (
    <div className={classes.card}>
      <div className={classes.wrapperHead}>
        <div className={classes.wrapperOrderId}>
          <div className={classes.titleOrderId}>Order ID:</div>
          <div className={classes.valueOrderId}>{orderDetail?.order_id}</div>
        </div>
        <div className={classes.chip}>Status: {orderDetail?.response_payment?.transaction_status}</div>
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
      <div className={classes.textWaiting}>
        <FormattedMessage id="app_orders_waiting_for_payment_title" />
      </div>
      {orderDetail?.response_payment?.transaction_status === 'pending' && (
        <div className={classes.wrapperBtnPending}>
          <Button type="button">
            <FormattedMessage id="app_orders_text_button_continue_payment" />
          </Button>
          <Button type="button" className={classes.btnCancel}>
            <FormattedMessage id="app_orders_text_button_cancel_reservation" />
          </Button>
        </div>
      )}
    </div>
  );
};

CardOrder.propTypes = {
  orderDetail: PropTypes.object,
};

export default CardOrder;
