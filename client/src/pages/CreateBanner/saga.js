import { takeLatest, call, put } from 'redux-saga/effects';

import { createBanner } from '@domain/api';

import { showPopup, setLoading } from '@containers/App/actions';

import { CREATE_BANNER } from '@pages/CreateBanner/constants';

function* doCreateBanner({ data, cbSuccess }) {
  yield put(setLoading(true));
  try {
    const response = yield call(createBanner, data);
    if (response) {
      cbSuccess();
    }
  } catch (error) {
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoading(false));
  }
}

export default function* createBannerSaga() {
  yield takeLatest(CREATE_BANNER, doCreateBanner);
}
