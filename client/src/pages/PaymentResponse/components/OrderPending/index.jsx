import PropTypes from 'prop-types';
import Countdown from 'react-countdown';
import { Divider } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import Container from '@components/Container';
import HeadTitle from '@components/HeadTitle';
import SubHeadTitle from '@components/SubHeadTitle';
import Button from '@components/Button';

import copyTextToClipboadrd from '@utils/copyTextToClipboadrd';
import formatCurrency from '@utils/formatCurrency';
import formateDate from '@utils/formateDate';

import classes from './style.module.scss';

const OrderPending = ({
  orderDetail,
  responsePayment,
  stayDuration,
  startReservation,
  totalPrice,
  endReservation,
  VAnumber,
  expiryDate,
  detailCabin,
}) => {
  const navigate = useNavigate();

  return (
    <Container className={classes.wrapper}>
      <>
        <div className={classes.wrapperCountdown}>
          <HeadTitle size={20} className={classes.title}>
            <FormattedMessage id="app_payment_response_pending_reservation_message" />
          </HeadTitle>
          <div className={classes.titleAccountNumber}>Account Number</div>
          <div className={classes.noVa}>{VAnumber}</div>
          <Button onClick={() => copyTextToClipboadrd(VAnumber)} className={classes.btnCopy}>
            <FormattedMessage id="app_response_payment_title_button_copy_va" />
          </Button>
          <div className={classes.boxinterval}>
            {responsePayment && (
              <Countdown
                date={responsePayment?.expiry_time || 0}
                renderer={({ hours, minutes, seconds, completed }) => {
                  if (completed) {
                    navigate('/user/orders');
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
            <div className={classes.expiry_date}>{expiryDate}</div>
          </div>
          <Button onClick={() => navigate('/user/orders')} type="button" className={classes.btnContinue}>
            <FormattedMessage id="app_response_payment_button_continue" />
          </Button>
        </div>

        <div className={classes.wrapperOrderDetail}>
          <div className={classes.wrapperOrderid}>
            <div className={classes.titleValue}>Order Id</div>
            <div className={classes.value}>{responsePayment?.order_id}</div>
          </div>
          <Divider className={classes.divider} />
          <div className={classes.roomName}>{orderDetail?.room?.name}</div>
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
              <div className={classes.value}>{orderDetail?.stay_duration}</div>
            </div>
          </div>
          <div className={classes.wrapperDetailRoom}>
            <div className={classes.title}>Cabin(s)</div>
            <div className={classes.wrapperContent}>
              <div className={classes.content}>
                <HeadTitle size={12} title={detailCabin?.type_room?.name} />
                <SubHeadTitle size={11} title={formatCurrency(Number(detailCabin?.type_room?.price))} mt={0} />
              </div>
              <div className={classes.content}>
                <HeadTitle size={12}>
                  <FormattedMessage id="app_reservation_service_fee_title" />
                </HeadTitle>
                <SubHeadTitle size={11} mt={0}>
                  <FormattedMessage id="app_reservation_service_fee_value" />
                </SubHeadTitle>
              </div>
              <div className={classes.content}>
                <HeadTitle size={12}>
                  <FormattedMessage id="app_home_title_duration_search_selelct" />
                </HeadTitle>
                <SubHeadTitle size={11} mt={0} title={`${stayDuration}Night(s)`} />
              </div>
              <Divider className={classes.dividerDetail} />
              <div className={classes.content}>
                <HeadTitle size={12} title="Total" />
                <div className={classes.valueTotalPrice}>{totalPrice}</div>
              </div>
            </div>
          </div>
        </div>
      </>
    </Container>
  );
};
OrderPending.propTypes = {
  orderDetail: PropTypes.object,
  startReservation: PropTypes.number,
  endReservation: PropTypes.number,
  stayDuration: PropTypes.number,
  VAnumber: PropTypes.string,
  expiryDate: PropTypes.string,
  totalPrice: PropTypes.string,
  responsePayment: PropTypes.object,
  detailCabin: PropTypes.object,
};

export default OrderPending;
