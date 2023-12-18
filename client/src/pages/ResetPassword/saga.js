import { takeLatest, call, put } from 'redux-saga/effects';

import { resetPassword, verifyTokenResetPassword } from '@domain/api';

import { setLoading, showPopup } from '@containers/App/actions';

import { setLoading as setLoadingResetPassword } from '@pages/ResetPassword/actions';
import { RESET_PASSWORD, VERIFY_TOKEN_RESET_PASSWORD } from '@pages/ResetPassword/constants';

function* doResetPassword({ payload, cb }) {
  yield put(setLoadingResetPassword(true));
  try {
    const response = yield call(resetPassword, payload?.token, payload?.data);
    if (response) {
      cb();
    }
  } catch (error) {
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoadingResetPassword(false));
  }
}

function* doVerifyTokenResetPassword({ token, cbSuccess, cbError }) {
  yield put(setLoading(true));
  try {
    const response = yield call(verifyTokenResetPassword, token);
    if (response) {
      cbSuccess();
    }
  } catch (error) {
    cbError(error?.response?.data?.message);
  } finally {
    yield put(setLoading(false));
  }
}

export default function* resetPasswordSaga() {
  yield takeLatest(RESET_PASSWORD, doResetPassword);
  yield takeLatest(VERIFY_TOKEN_RESET_PASSWORD, doVerifyTokenResetPassword);
}
