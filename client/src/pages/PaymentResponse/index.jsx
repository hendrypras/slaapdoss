import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import { selectOrderDetail } from '@pages/Orders/selectors';
import { getDetailOrder } from '@pages/Orders/actions';
import OrderPending from '@pages/PaymentResponse/components/OrderPending';
import OrderSuccess from '@pages/PaymentResponse/components/OrderSuccess';

import formateDate from '@utils/formateDate';
import formatCurrency from '@utils/formatCurrency';
import { calculateDurationInDays } from '@utils/times';
import { decryptTextPayload } from '@utils/decryptPayload';

const PaymentResponse = ({ orderDetail }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId, status } = useParams();

  const responsePayment = orderDetail?.response_payment;
  const detailCabin = orderDetail?.room;
  const VAnumber = responsePayment?.va_numbers?.length
    ? responsePayment?.va_numbers[0]?.va_number
    : responsePayment?.va_number;
  const startReservation = parseInt(orderDetail?.start_reservation, 10);
  const endReservation = parseInt(orderDetail?.end_reservation, 10);
  const stayDuration = calculateDurationInDays(startReservation, endReservation);
  const startDateFormated = formateDate(startReservation, 'HH:mm - DD MMM YYYY');
  const endDateFormated = formateDate(endReservation, 'HH:mm - DD MMM YYYY');
  const totalPrice = formatCurrency(Number(orderDetail?.total_price));
  const expiryDateFormated = formateDate(parseInt(responsePayment?.expiry_time, 10), 'DD MMMM YYYY, hh:mm');
  const nikDecode = decryptTextPayload(orderDetail?.user?.id_card?.nik);

  useEffect(() => {
    if (orderId && status && !orderDetail) {
      dispatch(
        getDetailOrder(orderId, null, () => {
          navigate('/notfound');
        })
      );
    }
  }, [dispatch, status, orderId, navigate, orderDetail]);
  useEffect(() => {
    if (status && responsePayment && responsePayment?.transaction_status !== status) {
      navigate('/notfound');
    }
  }, [responsePayment, navigate, status]);
  switch (status) {
    case 'pending':
      return (
        <OrderPending
          orderDetail={orderDetail}
          responsePayment={responsePayment}
          stayDuration={stayDuration}
          startReservation={startReservation}
          endReservation={endReservation}
          totalPrice={totalPrice}
          expiryDate={expiryDateFormated}
          detailCabin={detailCabin}
          VAnumber={VAnumber}
        />
      );
    case 'settlement':
      return (
        <OrderSuccess
          orderDetail={orderDetail}
          nik={nikDecode}
          startReservation={startDateFormated}
          totalPrice={totalPrice}
          endReservation={endDateFormated}
        />
      );
  }
};

const mapStateToProps = createStructuredSelector({
  orderDetail: selectOrderDetail,
});
PaymentResponse.propTypes = {
  orderDetail: PropTypes.object,
};

export default connect(mapStateToProps)(PaymentResponse);
