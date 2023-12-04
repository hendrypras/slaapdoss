import { takeLatest, call, put } from 'redux-saga/effects';

import { registEmail, register, verifyOtp } from '@domain/api';

import { showPopup } from '@containers/App/actions';

import { setExpOtp, setLoading as setLoadingRegister, setTokenStep } from '@pages/Register/actions';
import { REGIST_EMAIL, USER_REGISTER, VERIFY_OTP } from '@pages/Register/constants';

function* doUserRegister({ data, cb }) {
  yield put(setLoadingRegister(true));
  try {
    const response = yield call(register, data);
    if (response) {
      yield put(setTokenStep(null));
      cb();
    }
  } catch (error) {
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoadingRegister(false));
  }
}
function* doRegistEmail({ data, cbSuccess }) {
  yield put(setLoadingRegister(true));
  try {
    const response = yield call(registEmail, data);
    if (response) {
      yield put(setTokenStep(response.data.token));
      yield put(setExpOtp(response.data.otpExp));
      cbSuccess && cbSuccess(response.data.otpExp);
    }
  } catch (error) {
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoadingRegister(false));
  }
}
function* doVerifyOtp({ data, cbError }) {
  yield put(setLoadingRegister(true));
  try {
    const response = yield call(verifyOtp, data);
    if (response) {
      yield put(setTokenStep(response.data.token));
    }
  } catch (error) {
    if (error?.response?.status === 400) {
      cbError();
    }
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoadingRegister(false));
  }
}

export default function* registerSaga() {
  yield takeLatest(REGIST_EMAIL, doRegistEmail);
  yield takeLatest(VERIFY_OTP, doVerifyOtp);
  yield takeLatest(USER_REGISTER, doUserRegister);
}
