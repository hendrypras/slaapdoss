import { takeLatest, call, put } from 'redux-saga/effects';

import { deleteBanner, getBannersAdmin, updateStatusBanner } from '@domain/api';

import { showPopup, setLoading } from '@containers/App/actions';

import { DELETE_BANNER, GET_BANNERS, UPDATE_STATUS_BANNER } from '@pages/ListBanner/constants';
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
function* doDeleteBanner({ bannerId, cbSuccess }) {
  yield put(setLoading(true));
  try {
    const response = yield call(deleteBanner, bannerId);
    if (response) {
      cbSuccess();
    }
  } catch (error) {
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoading(false));
  }
}
function* doUpdateStatusBanner({ status, bannerId, cbSuccess }) {
  yield put(setLoading(true));
  try {
    const response = yield call(updateStatusBanner, status, bannerId);
    if (response) {
      cbSuccess();
    }
  } catch (error) {
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoading(false));
  }
}

export default function* listBannerSaga() {
  yield takeLatest(GET_BANNERS, doGetBanners);
  yield takeLatest(DELETE_BANNER, doDeleteBanner);
  yield takeLatest(UPDATE_STATUS_BANNER, doUpdateStatusBanner);
}
