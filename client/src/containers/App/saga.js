import { takeLatest, call, put } from 'redux-saga/effects';

import { getAssets, getTranslation } from '@domain/api';

import { setAssets, setLoading, showPopup } from '@containers/App/actions';
import { GET_ASSETS, GET_TRANSLATIONS } from '@containers/App/constants';
import { setMessages } from '@containers/Language/actions';

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
function* doGetTranslation() {
  yield put(setLoading(true));
  try {
    const response = yield call(getTranslation);
    if (response) {
      yield put(setMessages(response.data));
    }
  } catch (error) {
    yield put(showPopup());
  } finally {
    yield put(setLoading(false));
  }
}

export default function* appSaga() {
  yield takeLatest(GET_ASSETS, doGetAssets);
  yield takeLatest(GET_TRANSLATIONS, doGetTranslation);
}
