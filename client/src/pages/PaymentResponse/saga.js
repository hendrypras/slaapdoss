import { takeLatest, call, put } from 'redux-saga/effects';
import toast from 'react-hot-toast';

import { getResponsePaymentByOrderId } from '@domain/api';

import { setLoading } from '@containers/App/actions';

import { GET_RESPONSE_PAYMENT_BY_ORDER_ID } from '@pages/PaymentResponse/constants';
import { setResponsePayment } from '@pages/PaymentResponse/actions';

function* doGetListPaymentMethod({ orderId }) {
  yield put(setLoading(true));
  try {
    const response = yield call(getResponsePaymentByOrderId, orderId);
    if (response) {
      yield put(setResponsePayment(response?.data));
    }
  } catch (error) {
    toast.error(error.response.data.message || error.message);
  } finally {
    yield put(setLoading(false));
  }
}

export default function* paymentResponseSaga() {
  yield takeLatest(GET_RESPONSE_PAYMENT_BY_ORDER_ID, doGetListPaymentMethod);
}
