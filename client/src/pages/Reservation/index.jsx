import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { TrendingFlatOutlined, LocationOn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { selectAssets } from '@containers/App/selectors';

import Container from '@components/Container';

import HeadTitle from '@components/HeadTitle';

import { selectUserData, selectUserProfile } from '@pages/UserProfile/selectors';
import { getDataCrutialUser } from '@pages/UserProfile/actions';

import formatCurrency from '@utils/formatCurrency';

import Button from '@components/Button';
import classes from './style.module.scss';

const Reservation = ({ assets, dataUser, userProfile }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDataCrutialUser());
  }, [dispatch]);
  return (
    <Container className={classes.container}>
      <div className={classes.leftWrapper}>
        <button className={classes.btnBack} type="button" aria-label="button back" onClick={() => navigate(-1)}>
          <TrendingFlatOutlined className={classes.icon} />
          <FormattedMessage id="aap_reservation_title_back_btn" />
        </button>
        <div className={classes.wrapperOrderDetail}>
          <HeadTitle className={classes.headTitle} titleId="app_reservation_order_detail_head_title" />
          <HeadTitle className={classes.addressTitle} titleId="app_reservation_cabin_address_title" />
          <div className={classes.cabinAddress}>
            <LocationOn className={classes.icon} />
            Bobopod Alun-Alun, Bandung Jl. Kepatihan No.8, Balonggede, Kec. Regol, Kota Bandung, West Java 40251,
            Indonesia
          </div>
          <div className={classes.listDetail}>
            <div className={classes.list}>
              <HeadTitle className={classes.title} titleId="app_reservation_checkin_title" />
              <div className={classes.value}>08 desc 2023</div>
              <div className={classes.time}>{assets?.check_in_procedure?.check_in}</div>
            </div>
            <div className={classes.list}>
              <HeadTitle className={classes.title} titleId="app_reservation_checkout_title" />
              <div className={classes.value}>08 desc 2023</div>
              <div className={classes.time}>{assets?.check_in_procedure?.check_out}</div>
            </div>
            <div className={classes.list}>
              <HeadTitle className={classes.title} titleId="app_reservation_stay_duration_title" />
              <div className={classes.value}>1 Night</div>
            </div>
            <div className={classes.list}>
              <HeadTitle className={classes.title} titleId="app_reservation_cabin_type_title" />
              <div className={classes.value}>Deluxe</div>
            </div>
            <div className={classes.list}>
              <HeadTitle className={classes.title} titleId="app_reservation_cabin_total_title" />
              <div className={classes.value}>1 Cabin</div>
            </div>
            <div className={classes.list}>
              <HeadTitle className={classes.title} titleId="app_reservation_room_capacity_title" />
              <div className={classes.value}>1 Adult, 0 Children</div>
            </div>
          </div>
        </div>
        <div className={classes.wrapperContactDetail}>
          <HeadTitle className={classes.headTitle} titleId="app_reservation_contact_detail_head_title" />
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

      <div className={classes.wrapperPriceDetail}>
        <HeadTitle className={classes.headTitle} titleId="app_reservation_price_detail_head_title" />
        <div className={classes.wrapperPriceList}>
          <div className={classes.list}>
            <div className={classNames(classes.title, classes.value)}>1 Standard Cabin</div>
            <div className={classNames(classes.value, classes.cabin)}>{formatCurrency(466333)}</div>
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
            <div className={classNames(classes.title, classes.total)}>TOTAL</div>
            <div className={classNames(classes.value, classes.total)}>{formatCurrency(466333)}</div>
          </div>
        </div>
        <Button className={classes.btnContinue} type="button" text="app_reservation_continue_payment_title" />
      </div>
    </Container>
  );
};

const mapStateToProps = createStructuredSelector({
  assets: selectAssets,
  dataUser: selectUserData,
  userProfile: selectUserProfile,
});

Reservation.propTypes = {
  assets: PropTypes.object,
  dataUser: PropTypes.object,
  userProfile: PropTypes.object,
};

export default connect(mapStateToProps)(Reservation);
