import { takeLatest, call, put } from 'redux-saga/effects';
import toast from 'react-hot-toast';

import { resetPassword } from '@domain/api';

import { setLoading as setLoadingResetPassword } from '@pages/ResetPassword/actions';
import { RESET_PASSWORD } from '@pages/ResetPassword/constants';

function* doResetPassword({ payload, cb }) {
  yield put(setLoadingResetPassword(true));
  try {
    const response = yield call(resetPassword, payload?.token, payload?.data);
    if (response) {
      cb();
    }
  } catch (error) {
    toast.error(error.response.data.message || error.message);
  } finally {
    yield put(setLoadingResetPassword(false));
  }
}

export default function* resetPasswordSaga() {
  yield takeLatest(RESET_PASSWORD, doResetPassword);
}
