import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Divider } from '@mui/material';

import Container from '@components/Container';
import HeadTitle from '@components/HeadTitle';

import classes from './style.module.scss';

const OrderSuccess = ({ orderDetail, nik, startReservation, endReservation, totalPrice }) => (
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
          <div className={classNames(classes.value, classes.orderId)}>{orderDetail?.order_id}</div>
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
          <div className={classNames(classes.value, classes.time)}>{orderDetail?.user?.email}</div>
        </div>
        <div className={classes.content}>
          <HeadTitle className={classes.title}>
            <FormattedMessage id="app_dashboard_create_cabins_title_form_name" />
          </HeadTitle>
          <div className={classNames(classes.value, classes.time)}>{orderDetail?.user?.id_card?.name}</div>
        </div>
        <div className={classes.content}>
          <HeadTitle className={classes.title} title="NIK" />
          <div className={classNames(classes.value, classes.time)}>{nik?.slice(0, 6)}******</div>
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
          <div className={classNames(classes.value, classes.capt)}>{orderDetail?.room?.type_room?.name}</div>
        </div>
        <div className={classes.content}>
          <HeadTitle className={classes.title}>
            <FormattedMessage id="app_reservation_room_number_title" />
          </HeadTitle>
          <div className={classes.value}>{orderDetail?.room?.room_number}</div>
        </div>
        <div className={classes.content}>
          <HeadTitle className={classes.title}>
            <FormattedMessage id="app_reservation_stay_duration_title" />
          </HeadTitle>
          <div className={classes.value}>{orderDetail?.stay_duration} Night(s)</div>
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
            <div className={classNames(classes.value)}>{orderDetail?.room?.cabin?.address}</div>
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
            <FormattedMessage id="app_reservation_virtual_account_title" /> {orderDetail?.response_payment?.bank}
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

OrderSuccess.propTypes = {
  orderDetail: PropTypes.object,
  nik: PropTypes.string,
  startReservation: PropTypes.string,
  endReservation: PropTypes.string,
  totalPrice: PropTypes.string,
};

export default OrderSuccess;
