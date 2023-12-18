import { takeLatest, call, put } from 'redux-saga/effects';

import { getOrders } from '@domain/api';

import { showPopup } from '@containers/App/actions';

import { GET_ORDERS } from '@pages/OrdersAdmin/constants';
import { setLoading, setOrders } from '@pages/OrdersAdmin/actions';

function* doGetordersUser({ orderId, page, limit }) {
  yield put(setLoading(true));
  try {
    const response = yield call(getOrders, orderId, page, limit);
    if (response) {
      yield put(setOrders(response?.data));
    }
  } catch (error) {
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoading(false));
  }
}

export default function* ordersAdminSaga() {
  yield takeLatest(GET_ORDERS, doGetordersUser);
}
