import { takeLatest, call, put } from 'redux-saga/effects';

import { requestPayment } from '@domain/api';

import { CREATE_PAYMENT_RESERVATION } from '@pages/Reservation/constants';

import { showPopup, setLoading } from '@containers/App/actions';

function* doCreatePayment({ data, cbSuccess, cbErr }) {
  yield put(setLoading(true));
  try {
    const response = yield call(requestPayment, data);
    if (response) {
      cbSuccess(response?.data?.order_id);
    }
  } catch (error) {
    cbErr(error.response.status);
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoading(false));
  }
}

export default function* reservationSaga() {
  yield takeLatest(CREATE_PAYMENT_RESERVATION, doCreatePayment);
}
