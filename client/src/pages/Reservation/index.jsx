import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { TrendingFlatOutlined, LocationOn } from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import { selectAssets, selectLoading } from '@containers/App/selectors';
import { showPopup } from '@containers/App/actions';

import Button from '@components/Button';
import Container from '@components/Container';

import PaymentMethod from '@pages/Reservation/components/PaymentMethod';
import { selectUserData, selectUserProfile } from '@pages/UserProfile/selectors';
import { getDataCrutialUser } from '@pages/UserProfile/actions';
import { selectMethod } from '@pages/Reservation/selectors';
import { createPayment } from '@pages/Reservation/actions';
import { selectDetailRoomCabin } from '@pages/DetailCabins/selectors';
import { getDetailRoomCabin } from '@pages/DetailCabins/actions';

import formatCurrency from '@utils/formatCurrency';
import encryptPayload from '@utils/encryptPayload';
import formateDate from '@utils/formateDate';
import { calculateDurationInDays, getCheckIn, getCheckOut } from '@utils/times';

import classes from './style.module.scss';

const Reservation = ({ assets, dataUser, userProfile, method, loading, detailRoomCabin, intl: { formatMessage } }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [acceptPayment, setAcceptPayment] = useState(false);
  const { slugCabin, roomId } = useParams();

  const queryParams = new URLSearchParams(location.search);
  const dateStart = queryParams.get('dateStart');
  const dateEnd = queryParams.get('dateEnd');
  const dateCheckIn = getCheckIn(dateStart);
  const dateCheckOut = getCheckOut(dateEnd);
  const priceCabin = detailRoomCabin?.price;
  const stayDuration = calculateDurationInDays(parseInt(dateCheckIn.unix, 10), parseInt(dateCheckOut.unix, 10));
  useEffect(() => {
    if (slugCabin && roomId) {
      dispatch(getDetailRoomCabin(slugCabin, roomId));
    }
    dispatch(getDataCrutialUser());
  }, [dispatch, slugCabin, roomId]);
  const handleSubmitPayment = (e) => {
    e.preventDefault();
    if (!method) {
      dispatch(
        showPopup(
          '',
          '',
          '',
          'app_reservation_title_empty_payment_method',
          'app_reservation_message_empty_payment_method'
        )
      );
      return;
    }
    if (!dateStart && !dateEnd && !acceptPayment) {
      Swal.fire({
        title: formatMessage({ id: 'app_reservation_title_warning_duration' }),
        text: formatMessage({ id: 'app_reservation_message_warning_duration' }),
        icon: 'question',
        confirmButtonText: 'Oke',
        preConfirm: () => setAcceptPayment(true),
      });
      return;
    }
    dispatch(
      createPayment(
        {
          paymentType: method?.paymentType,
          bank: method?.bank,
          roomId,
          startReservation: parseInt(dateCheckIn.unix, 10),
          endReservation: parseInt(dateCheckOut.unix, 10),
          stayDuration: encryptPayload(stayDuration.toString()),
          price: encryptPayload(priceCabin?.toString()),
        },
        (orderId) => {
          navigate(`/payment/pending/${orderId}`);
        },
        () => {
          navigate(`/user/profile`);
        }
      )
    );
  };
  return (
    <Container className={classes.container}>
      <>
        <div className={classes.leftWrapper}>
          <button className={classes.btnBack} type="button" aria-label="button back" onClick={() => navigate(-1)}>
            <TrendingFlatOutlined className={classes.icon} />
            <FormattedMessage id="aap_reservation_title_back_btn" />
          </button>
          <div className={classes.wrapperOrderDetail}>
            <div className={classes.headTitle}>
              <FormattedMessage id="app_reservation_order_detail_head_title" />
            </div>
            <div className={classes.addressTitle}>
              <FormattedMessage id="app_reservation_cabin_address_title" />
            </div>
            <div className={classes.cabinAddress}>
              <LocationOn className={classes.icon} />
              {detailRoomCabin?.address}
            </div>
            <div className={classes.listDetail}>
              <div className={classes.list}>
                <div className={classes.title}>
                  <FormattedMessage id="app_reservation_checkin_title" />
                </div>
                <div className={classes.value}>{formateDate(dateStart, 'DD MMM YYYY')}</div>
                <div className={classes.time}>14:00</div>
              </div>
              <div className={classes.list}>
                <div className={classes.title}>
                  <FormattedMessage id="app_reservation_checkout_title" />
                </div>
                <div className={classes.value}>{formateDate(dateCheckOut.unix, 'DD MMM YYYY')}</div>
                <div className={classes.time}>12:00</div>
              </div>
              <div className={classes.list}>
                <div className={classes.title}>
                  <FormattedMessage id="app_reservation_stay_duration_title" />
                </div>
                <div className={classes.value}>{stayDuration} Night</div>
              </div>
              <div className={classes.list}>
                <div className={classes.title}>
                  <FormattedMessage id="app_reservation_cabin_type_title" />
                </div>
                <div className={classes.value}>{detailRoomCabin?.typeCabin}</div>
              </div>
              <div className={classes.list}>
                <div className={classes.title}>
                  <FormattedMessage id="app_reservation_room_number_title" />
                </div>
                <div className={classes.value}>{detailRoomCabin?.roomNumber}</div>
              </div>
              <div className={classes.list}>
                <div className={classes.title}>
                  <FormattedMessage id="app_reservation_room_capacity_title" />
                </div>
                <div className={classes.value}>{detailRoomCabin?.capacity}</div>
              </div>
            </div>
          </div>
          <div className={classes.wrapperContactDetail}>
            <div className={classes.headTitle}>
              <FormattedMessage id="app_reservation_contact_detail_head_title" />
            </div>
            <div className={classes.box}>
              <div className={classes.value}>{dataUser?.id_card?.name || userProfile?.username}</div>
              <div className={classes.title}>Name</div>
            </div>
            <div className={classes.box}>
              <div className={classes.value}>{dataUser?.email}</div>
              <div className={classes.title}>Email</div>
            </div>
          </div>
        </div>
        <div className={classes.rightWrapper}>
          <PaymentMethod methodList={assets.payment_method} methodSelected={method} />
          <div className={classes.wrapperPriceDetail}>
            <div className={classes.headTitle}>
              <FormattedMessage id="app_reservation_price_detail_head_title" />
            </div>
            <div className={classes.wrapperPriceList}>
              <div className={classes.list}>
                <div className={classNames(classes.title, classes.value)}>{detailRoomCabin?.typeCabin}</div>
                <div className={classNames(classes.value, classes.cabin)}>{formatCurrency(priceCabin)}</div>
              </div>
              <div className={classes.list}>
                <div className={classNames(classes.title)}>
                  <FormattedMessage id="app_reservation_service_fee_title" />
                </div>
                <div className={classNames(classes.value)}>
                  <FormattedMessage id="app_reservation_service_fee_value" />
                </div>
              </div>
              <div className={classes.list}>
                <div className={classNames(classes.title)}>
                  <FormattedMessage id="app_home_title_duration_search_selelct" />
                </div>
                <div className={classNames(classes.value)}>{stayDuration}</div>
              </div>
              <div className={classes.list}>
                <div className={classNames(classes.title, classes.total)}>TOTAL</div>
                <div className={classNames(classes.value, classes.total)}>
                  {formatCurrency(Number(priceCabin) * Number(stayDuration))}
                </div>
              </div>
            </div>
            <Button className={classes.btnContinue} onClick={handleSubmitPayment} isLoading={loading} type="button">
              <FormattedMessage id="app_reservation_continue_payment_title" />
            </Button>
          </div>
        </div>
      </>
    </Container>
  );
};

const mapStateToProps = createStructuredSelector({
  assets: selectAssets,
  method: selectMethod,
  dataUser: selectUserData,
  userProfile: selectUserProfile,
  loading: selectLoading,
  detailRoomCabin: selectDetailRoomCabin,
});

Reservation.propTypes = {
  assets: PropTypes.object,
  dataUser: PropTypes.object,
  method: PropTypes.object,
  userProfile: PropTypes.object,
  loading: PropTypes.bool,
  detailRoomCabin: PropTypes.object,
  intl: PropTypes.object,
};

export default injectIntl(connect(mapStateToProps)(Reservation));
