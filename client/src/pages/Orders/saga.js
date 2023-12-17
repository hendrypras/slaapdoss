import { takeLatest, call, put } from 'redux-saga/effects';

import { cancelPayment, getOrders } from '@domain/api';

import { showPopup, setLoading as setLoadingGlobal } from '@containers/App/actions';

import { CANCEL_TRANSCACTION, GET_ORDERS_USER } from '@pages/Orders/constants';
import { setOrdersUser, setLoading } from '@pages/Orders/actions';

function* doGetordersUser({ orderId, page, limit }) {
  yield put(setLoading(true));
  try {
    const response = yield call(getOrders, orderId, page, limit);
    if (response) {
      yield put(setOrdersUser(response?.data));
    }
  } catch (error) {
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoading(false));
  }
}
function* doCancelTransaction({ orderId, cbSuccess }) {
  yield put(setLoadingGlobal(true));
  try {
    const response = yield call(cancelPayment, orderId);
    if (response) {
      cbSuccess();
    }
  } catch (error) {
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoadingGlobal(false));
  }
}

export default function* ordersSaga() {
  yield takeLatest(GET_ORDERS_USER, doGetordersUser);
  yield takeLatest(CANCEL_TRANSCACTION, doCancelTransaction);
}
