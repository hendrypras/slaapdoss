import { takeLatest, call, put } from 'redux-saga/effects';

import { cancelPayment, getDetailOrder, getOrdersUser } from '@domain/api';

import { showPopup, setLoading as setLoadingGlobal } from '@containers/App/actions';

import { CANCEL_TRANSCACTION, GET_ORDERS_USER, GET_ORDER_SUCCESS } from '@pages/Orders/constants';
import { setOrdersUser, setOrderDetail } from '@pages/Orders/actions';

function* doGetordersUser({ orderId, page, limit, cbError }) {
  yield put(setLoadingGlobal(true));
  try {
    const response = yield call(getOrdersUser, orderId, page, limit);
    if (response) {
      yield put(setOrdersUser(response?.data));
    }
  } catch (error) {
    if (error.response.status === 404 && cbError) {
      return cbError();
    }
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoadingGlobal(false));
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
function* doGetDetailOrder({ orderId, cbSuccess, cbError }) {
  yield put(setLoadingGlobal(true));
  try {
    const response = yield call(getDetailOrder, orderId);
    if (response) {
      yield put(setOrderDetail(response.data));
      cbSuccess && cbSuccess();
    }
  } catch (error) {
    if (error.response.status === 404 && cbError) {
      return cbError();
    }
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoadingGlobal(false));
  }
}

export default function* ordersSaga() {
  yield takeLatest(GET_ORDERS_USER, doGetordersUser);
  yield takeLatest(CANCEL_TRANSCACTION, doCancelTransaction);
  yield takeLatest(GET_ORDER_SUCCESS, doGetDetailOrder);
}
