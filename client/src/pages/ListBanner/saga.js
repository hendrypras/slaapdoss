import { takeLatest, call, put } from 'redux-saga/effects';

import { getBannersAdmin } from '@domain/api';

import { showPopup, setLoading } from '@containers/App/actions';

import { GET_BANNERS } from '@pages/ListBanner/constants';
import { setBanners } from '@pages/ListBanner/actions';

function* doGetBanners() {
  yield put(setLoading(true));
  try {
    const response = yield call(getBannersAdmin);
    if (response) {
      yield put(setBanners(response?.data));
    }
  } catch (error) {
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoading(false));
  }
}

export default function* listBannerSaga() {
  yield takeLatest(GET_BANNERS, doGetBanners);
}
