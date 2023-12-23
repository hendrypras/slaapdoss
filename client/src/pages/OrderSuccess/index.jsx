import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Divider } from '@mui/material';

import Container from '@components/Container';
import HeadTitle from '@components/HeadTitle';

import { selectOrderSuccess } from '@pages/Orders/selectors';
import { getOrderSuccess } from '@pages/Orders/actions';

import formateDate from '@utils/formateDate';
import formatCurrency from '@utils/formatCurrency';

import classNames from 'classnames';
import { decryptTextPayload } from '@utils/decryptPayload';
import classes from './style.module.scss';

const OrderSuccess = ({ orderSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const startReservation = formateDate(parseInt(orderSuccess?.start_reservation, 10), 'HH:mm - DD MMM YYYY');
  const endReservation = formateDate(parseInt(orderSuccess?.end_reservation, 10), 'HH:mm - DD MMM YYYY');
  const totalPrice = formatCurrency(Number(orderSuccess?.total_price));

  const nikDecode = decryptTextPayload(orderSuccess?.user?.id_card?.nik);
  useEffect(() => {
    dispatch(
      getOrderSuccess(orderId, () => {
        navigate('/notfound');
      })
    );
  }, [navigate, dispatch, orderId]);

  return (
    <Container className={classes.wrapper}>
      <>
        <HeadTitle size={22} className={classes.headTitle}>
          <FormattedMessage id="aap_reservation_title_complete" />
        </HeadTitle>
        <div className={classes.wrapperContent}>
          <div className={classes.content}>
            <HeadTitle className={classes.title}>
              <FormattedMessage id="app_orders_title_order_id" />
            </HeadTitle>
            <div className={classNames(classes.value, classes.orderId)}>{orderSuccess?.order_id}</div>
          </div>
          <Divider
            sx={{
              '&::before, &::after': {
                borderColor: 'red',
              },
            }}
          />
          <div className={classes.content}>
            <HeadTitle className={classes.title}>
              <FormattedMessage id="app_login_sign_in_email_title" />
            </HeadTitle>
            <div className={classNames(classes.value, classes.time)}>{orderSuccess?.user?.email}</div>
          </div>
          <div className={classes.content}>
            <HeadTitle className={classes.title}>
              <FormattedMessage id="app_dashboard_create_cabins_title_form_name" />
            </HeadTitle>
            <div className={classNames(classes.value, classes.time)}>{orderSuccess?.user?.id_card?.name}</div>
          </div>
          <div className={classes.content}>
            <HeadTitle className={classes.title} title="NIK" />
            <div className={classNames(classes.value, classes.time)}>{nikDecode?.slice(0, 6)}******</div>
          </div>
          <Divider
            sx={{
              '&::before, &::after': {
                borderColor: 'red',
              },
            }}
          />
          <div className={classes.content}>
            <HeadTitle className={classes.title}>
              <FormattedMessage id="app_reservation_cabin_type_title" />
            </HeadTitle>
            <div className={classNames(classes.value, classes.capt)}>{orderSuccess?.room?.type_room?.name}</div>
          </div>
          <div className={classes.content}>
            <HeadTitle className={classes.title}>
              <FormattedMessage id="app_reservation_room_number_title" />
            </HeadTitle>
            <div className={classes.value}>{orderSuccess?.room?.room_number}</div>
          </div>
          <div className={classes.content}>
            <HeadTitle className={classes.title}>
              <FormattedMessage id="app_reservation_stay_duration_title" />
            </HeadTitle>
            <div className={classes.value}>{orderSuccess?.stay_duration} Night(s)</div>
          </div>
          <div className={classes.content}>
            <HeadTitle className={classes.title}>
              <FormattedMessage id="app_reservation_checkin_title" />
            </HeadTitle>
            <div className={classNames(classes.value, classes.time)}>{startReservation}</div>
          </div>
          <div className={classes.content}>
            <HeadTitle className={classes.title}>
              <FormattedMessage id="app_reservation_checkout_title" />
            </HeadTitle>
            <div className={classNames(classes.value, classes.time)}>{endReservation}</div>
          </div>
          <div className={classes.content}>
            <div>
              <HeadTitle className={classes.title}>
                <FormattedMessage id="app_reservation_cabin_address_title" />
              </HeadTitle>
              <div className={classNames(classes.value)}>{orderSuccess?.room?.cabin?.address}</div>
            </div>
          </div>
          <Divider
            sx={{
              '&::before, &::after': {
                borderColor: 'red',
              },
            }}
          />
          <div className={classes.content}>
            <HeadTitle className={classes.title}>
              <FormattedMessage id="aap_reservation_title_payment_method" />
            </HeadTitle>
            <div className={classNames(classes.value, classes.capt)}>
              <FormattedMessage id="app_reservation_virtual_account_title" /> {orderSuccess?.response_payment?.bank}
            </div>
          </div>
          <div className={classes.content}>
            <HeadTitle className={classes.title} title="Total" />
            <div className={classNames(classes.value, classes.capt)}>{totalPrice}</div>
          </div>
        </div>
      </>
    </Container>
  );
};

const mapStateToProps = createStructuredSelector({
  orderSuccess: selectOrderSuccess,
});
OrderSuccess.propTypes = {
  orderSuccess: PropTypes.object,
};

export default connect(mapStateToProps)(OrderSuccess);
