import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { TrendingFlatOutlined, LocationOn, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';

import { selectAssets, selectLoading } from '@containers/App/selectors';
import { showPopup } from '@containers/App/actions';

import Button from '@components/Button';
import Container from '@components/Container';
import HeadTitle from '@components/HeadTitle';

import { selectUserData, selectUserProfile } from '@pages/UserProfile/selectors';
import { getDataCrutialUser } from '@pages/UserProfile/actions';
import { selectMethod } from '@pages/Reservation/selectors';
import { createPayment, selectPaymentMethod } from '@pages/Reservation/actions';
import { selectDetailRoomCabin } from '@pages/DetailCabins/selectors';

import formatCurrency from '@utils/formatCurrency';
import encryptPayload from '@utils/encryptPayload';

import { getDetailRoomCabin } from '@pages/DetailCabins/actions';
import moment from 'moment';
import formateDate from '@utils/formateDate';
import classes from './style.module.scss';

const Reservation = ({ assets, dataUser, userProfile, method, loading, detailRoomCabin }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { slugCabin, roomId } = useParams();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const dateStart = queryParams.get('dateStart');
  const dateEnd = queryParams.get('dateEnd');
  const stayDuration = queryParams.get('duration');
  const unixDateStart = moment(`${dateStart} 14:00:00`).valueOf();
  const unixDateEnd = moment(`${dateEnd} 12:00:00`).valueOf();

  useEffect(() => {
    if (slugCabin && roomId && dateStart && dateEnd) {
      dispatch(getDetailRoomCabin(slugCabin, roomId));
    }
    dispatch(getDataCrutialUser());
  }, [dispatch, slugCabin, roomId, dateStart, dateEnd]);
  const handleSubmitPayment = (e) => {
    e.preventDefault();
    if (!method) {
      dispatch(
        showPopup(
          null,
          null,
          null,
          'app_reservation_title_empty_payment_method',
          'app_reservation_message_empty_payment_method'
        )
      );
      return;
    }
    dispatch(
      createPayment(
        {
          paymentType: method?.paymentType,
          bank: method?.bank,
          cabinRoomId: roomId,
          startReservation: parseInt(unixDateStart, 10),
          endReservation: parseInt(unixDateEnd, 10),
          stayDuration: encryptPayload(stayDuration),
          price: encryptPayload(detailRoomCabin?.price?.toString()),
        },
        (orderId) => {
          navigate(`/payment/pending/${orderId}`);
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
                <div className={classes.value}>{formateDate(dateEnd, 'DD MMM YYYY')}</div>
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
          <div className={classes.wrapperPaymentMethod}>
            <div className={classes.headTitle}>
              <FormattedMessage id="app_reservation_payment_method_title" />
            </div>
            <Accordion className={classes.accordion}>
              <AccordionSummary
                className={classes.summary}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <FormattedMessage id="app_reservation_virtual_account_title" />
              </AccordionSummary>
              <AccordionDetails className={classes.accordionDetails}>
                {assets?.payment_method?.map((val, i) => (
                  <div
                    hidden
                    key={i}
                    className={classes.wrapperCotentDetails}
                    onClick={() => dispatch(selectPaymentMethod({ paymentType: val?.type, bank: val?.method }))}
                  >
                    <img src={val?.icon_url} alt="icon" className={classes.icon} />
                    <div className={classes.content}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={method?.bank === val?.method}
                        onChange={() => dispatch(selectPaymentMethod({ paymentType: val?.type, bank: val?.method }))}
                        className={classes.radioButton}
                      />
                      <HeadTitle className={classes.title} title={val?.type_label} />
                      <div className={classes.desc}>
                        <FormattedMessage id={val?.instraction?.desc} />
                      </div>
                      <Accordion className={classes.accordionStep}>
                        <AccordionSummary
                          className={classes.summary}
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          ATM
                        </AccordionSummary>
                        {Object.values(val?.instraction?.atm?.step)?.map((step, stepIndex) => (
                          <AccordionDetails key={stepIndex} className={classes.accordionDetails}>
                            <div className={classes.number}>{stepIndex + 1}</div>
                            <div className={classes.stepText}>
                              <FormattedMessage id={step} />
                            </div>
                          </AccordionDetails>
                        ))}
                      </Accordion>
                      {val?.instraction && val?.instraction?.internet_banking && (
                        <Accordion className={classes.accordionStep}>
                          <AccordionSummary
                            className={classes.summary}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            Internet Banking
                          </AccordionSummary>
                          {Object.values(val?.instraction?.internet_banking?.step)?.map((step, stepIndex) => (
                            <AccordionDetails key={stepIndex} className={classes.accordionDetails}>
                              <div className={classes.number}>{stepIndex + 1}</div>
                              <div className={classes.stepText}>
                                <FormattedMessage id={step} />
                              </div>
                            </AccordionDetails>
                          ))}
                        </Accordion>
                      )}
                      {val?.instraction && val?.instraction?.klik_bca && (
                        <Accordion className={classes.accordionStep}>
                          <AccordionSummary
                            className={classes.summary}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            Klick BCA
                          </AccordionSummary>
                          {Object.values(val?.instraction?.klik_bca?.step)?.map((step, stepIndex) => (
                            <AccordionDetails key={stepIndex} className={classes.accordionDetails}>
                              <div className={classes.number}>{stepIndex + 1}</div>
                              <div className={classes.stepText}>
                                <FormattedMessage id={step} />
                              </div>
                            </AccordionDetails>
                          ))}
                        </Accordion>
                      )}
                      {val?.instraction && val?.instraction?.m_bca && (
                        <Accordion className={classes.accordionStep}>
                          <AccordionSummary
                            className={classes.summary}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            M BCA
                          </AccordionSummary>
                          {Object.values(val?.instraction?.m_bca?.step)?.map((step, stepIndex) => (
                            <AccordionDetails key={stepIndex} className={classes.accordionDetails}>
                              <div className={classes.number}>{stepIndex + 1}</div>
                              <div className={classes.stepText}>
                                <FormattedMessage id={step} />
                              </div>
                            </AccordionDetails>
                          ))}
                        </Accordion>
                      )}
                      {val?.instraction && val?.instraction?.m_banking && (
                        <Accordion className={classes.accordionStep}>
                          <AccordionSummary
                            className={classes.summary}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            M Banking
                          </AccordionSummary>
                          {Object.values(val?.instraction?.m_banking?.step)?.map((step, stepIndex) => (
                            <AccordionDetails key={stepIndex} className={classes.accordionDetails}>
                              <div className={classes.number}>{stepIndex + 1}</div>
                              <div className={classes.stepText}>
                                <FormattedMessage id={step} />
                              </div>
                            </AccordionDetails>
                          ))}
                        </Accordion>
                      )}
                    </div>
                  </div>
                ))}
              </AccordionDetails>
            </Accordion>
          </div>
          <div className={classes.wrapperPriceDetail}>
            <div className={classes.headTitle}>
              <FormattedMessage id="app_reservation_price_detail_head_title" />
            </div>
            <div className={classes.wrapperPriceList}>
              <div className={classes.list}>
                <div className={classNames(classes.title, classes.value)}>{detailRoomCabin?.typeCabin}</div>
                <div className={classNames(classes.value, classes.cabin)}>{formatCurrency(detailRoomCabin?.price)}</div>
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
                <div className={classNames(classes.value, classes.total)}>{formatCurrency(detailRoomCabin?.price)}</div>
              </div>
            </div>
            <Button
              className={classes.btnContinue}
              onClick={handleSubmitPayment}
              isLoading={loading}
              type="button"
              text="app_reservation_continue_payment_title"
            />
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
};

export default connect(mapStateToProps)(Reservation);
