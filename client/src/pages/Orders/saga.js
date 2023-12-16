import { takeLatest, call, put } from 'redux-saga/effects';

import { getOrders } from '@domain/api';

import { showPopup } from '@containers/App/actions';

import { GET_ORDERS_USER } from '@pages/Orders/constants';
import { setOrdersUser, setLoading } from '@pages/Orders/actions';

function* doGetordersUser({ orderId }) {
  yield put(setLoading(true));
  try {
    const response = yield call(getOrders, orderId);
    if (response) {
      yield put(setOrdersUser(response?.data));
    }
  } catch (error) {
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoading(false));
  }
}

export default function* ordersSaga() {
  yield takeLatest(GET_ORDERS_USER, doGetordersUser);
}
