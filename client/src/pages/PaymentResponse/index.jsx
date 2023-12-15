import { FormattedMessage } from 'react-intl';
import { useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import Countdown from 'react-countdown';
import { Divider } from '@mui/material';

import Container from '@components/Container';
import HeadTitle from '@components/HeadTitle';
import Button from '@components/Button';

import copyTextToClipboadrd from '@utils/copyTextToClipboadrd';
import formateDate from '@utils/formateDate';

import { selectOrders } from '@pages/PaymentResponse/selectors';
import { getOrdersUser } from '@pages/PaymentResponse/actions';

import classes from './style.module.scss';

const PaymentResponse = ({ orders }) => {
  const dispatch = useDispatch();
  const { orderId, status } = useParams();
  const responsePayment = orders?.results?.response_payment;
  const VAnumber = responsePayment?.va_numbers?.length
    ? responsePayment?.va_numbers[0]?.va_number
    : responsePayment?.va_number;
  const startReservation = parseInt(orders?.results?.start_reservation, 10);
  const endReservation = parseInt(orders?.results?.end_reservation, 10);
  useEffect(() => {
    if (orderId && status && Object.keys(orders).length === 0 && orders.constructor === Object) {
      dispatch(getOrdersUser(orderId));
    }
  }, [dispatch, status, orderId]);

  return (
    <Container className={classes.wrapper}>
      <>
        <HeadTitle className={classes.title} titleId="app_payment_response_pending_reservation_message" />
        <div className={classes.titleAccountNumber}>Account Number</div>
        <div className={classes.noVa}>{VAnumber}</div>
        <Button
          onClick={() => copyTextToClipboadrd(VAnumber)}
          className={classes.btnCopy}
          text="app_response_payment_title_button_copy_va"
        />
        <div className={classes.boxinterval}>
          {responsePayment && (
            <Countdown
              date={responsePayment?.expiry_time ? new Date(responsePayment.expiry_time).getTime() : 0}
              renderer={({ hours, minutes, seconds, completed }) => {
                if (completed) {
                  return <span>Countdown completed</span>;
                }
                return (
                  <div className={classes.countdownTime}>
                    {hours} : {minutes} : {seconds}
                  </div>
                );
              }}
            />
          )}
          <div className={classes.titlePayBefore}>
            <FormattedMessage id="app_response_payment_pay_in" />
          </div>
          <div className={classes.expiry_date}>
            {formateDate(orders?.results?.response_payment?.expiry_time, 'DD MMMM YYYY, hh:mm')}
          </div>
        </div>
        <div className={classes.wrapperOrderDetail}>
          <div className={classes.wrapperOrderid}>
            <div className={classes.titleValue}>Order Id</div>
            <div className={classes.value}>{responsePayment?.order_id}</div>
          </div>
          <Divider className={classes.divider} />
          <div className={classes.roomName}>{orders?.results?.room?.name}</div>
          <div className={classes.wrapperTime}>
            <div className={classes.wrapperContent}>
              <div className={classes.titleContent}>
                <FormattedMessage id="app_reservation_checkin_title" />
              </div>
              <div className={classes.value}>{formateDate(startReservation, 'DD MMMM YYYY')}</div>
              <div className={classes.timeValue}>{formateDate(startReservation, 'HH:mm')}</div>
            </div>
            <div className={classes.wrapperContent}>
              <div className={classes.titleContent}>
                <FormattedMessage id="app_reservation_checkout_title" />
              </div>
              <div className={classes.value}>{formateDate(endReservation, 'DD MMMM YYYY')}</div>
              <div className={classes.timeValue}>{formateDate(endReservation, 'HH:mm')}</div>
            </div>
            <div className={classes.wrapperContent}>
              <div className={classes.titleContent}>
                <FormattedMessage id="app_home_title_duration_search_selelct" />
              </div>
              <div className={classes.value}>{orders?.results?.stay_duration}</div>
            </div>
          </div>
          <div className={classes.wrapperDetailRoom}>
            <div className={classes.title}>Cabin(s)</div>
            <div className={classes.wrapperContent}>
              <div>
                <div />
              </div>
            </div>
          </div>
          {console.log(orders)}
        </div>
      </>
    </Container>
  );
};

const mapStateToProps = createStructuredSelector({
  orders: selectOrders,
});
PaymentResponse.propTypes = {
  orders: PropTypes.object,
};

export default connect(mapStateToProps)(PaymentResponse);
