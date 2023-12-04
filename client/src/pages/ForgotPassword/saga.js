import { takeLatest, call, put } from 'redux-saga/effects';
import toast from 'react-hot-toast';
import { forgotPassword } from '@domain/api';

import { setLoading as setLoadingForgotPassword } from '@pages/ForgotPassword/actions';
import { FORGOT_PASSWORD } from '@pages/ForgotPassword/constants';

function* doForgotPassword({ data, cb }) {
  yield put(setLoadingForgotPassword(true));
  try {
    const response = yield call(forgotPassword, data);
    if (response) {
      cb();
    }
  } catch (error) {
    toast.error(error.response.data.message || error.message);
  } finally {
    yield put(setLoadingForgotPassword(false));
  }
}

export default function* forgotPasswordSaga() {
  yield takeLatest(FORGOT_PASSWORD, doForgotPassword);
}
