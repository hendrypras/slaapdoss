import { takeLatest, call, put } from 'redux-saga/effects';

import { forgotPassword } from '@domain/api';

import { setLoading as setLoadingForgotPassword } from '@pages/ForgotPassword/actions';
import { FORGOT_PASSWORD } from '@pages/ForgotPassword/constants';

import { showPopup } from '@containers/App/actions';

function* doForgotPassword({ data, cbSuccess, cbError }) {
  yield put(setLoadingForgotPassword(true));
  try {
    const response = yield call(forgotPassword, data);
    if (response) {
      cbSuccess();
    }
  } catch (error) {
    cbError();
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoadingForgotPassword(false));
  }
}

export default function* forgotPasswordSaga() {
  yield takeLatest(FORGOT_PASSWORD, doForgotPassword);
}
