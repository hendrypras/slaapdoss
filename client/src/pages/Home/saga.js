import { takeLatest, call, put } from 'redux-saga/effects';

import { getBanners } from '@domain/api';

import { showPopup } from '@containers/App/actions';

import { setBanners, setLoading } from '@pages/Home/actions';
import { GET_BANNERS } from '@pages/Home/constants';

function* doGetBanners({ orderId }) {
  yield put(setLoading(true));
  try {
    const response = yield call(getBanners, orderId);
    if (response) {
      yield put(setBanners(response?.data));
    }
  } catch (error) {
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoading(false));
  }
}

export default function* homeSaga() {
  yield takeLatest(GET_BANNERS, doGetBanners);
}
