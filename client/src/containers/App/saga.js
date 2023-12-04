import { takeLatest, call, put } from 'redux-saga/effects';

import { getAssets } from '@domain/api';

import { setAssets, setLoading, showPopup } from '@containers/App/actions';
import { GET_ASSETS } from '@containers/App/constants';

function* doGetAssets() {
  yield put(setLoading(true));
  try {
    const response = yield call(getAssets);
    if (response) {
      yield put(setAssets(response.data));
    }
  } catch (error) {
    yield put(showPopup());
  } finally {
    yield put(setLoading(false));
  }
}

export default function* appSaga() {
  yield takeLatest(GET_ASSETS, doGetAssets);
}
