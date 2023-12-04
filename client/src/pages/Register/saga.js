import { takeLatest, call, put } from 'redux-saga/effects';
import toast from 'react-hot-toast';

import { registEmail, register, verifyOtp } from '@domain/api';

import { showPopup } from '@containers/App/actions';

import { setLoading as setLoadingRegister, setTokenStep } from '@pages/Register/actions';
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
    if (error.response.data) {
      toast.error(error.response.data.message);
      return;
    }
    yield put(showPopup());
  } finally {
    yield put(setLoadingRegister(false));
  }
}
function* doRegistEmail({ data }) {
  yield put(setLoadingRegister(true));
  try {
    const response = yield call(registEmail, data);
    if (response) {
      yield put(setTokenStep(response.data.token));
    }
  } catch (error) {
    if (error.response.data) {
      toast.error(error.response.data.message);
      return;
    }
    yield put(showPopup());
  } finally {
    yield put(setLoadingRegister(false));
  }
}
function* doVerifyOtp({ data }) {
  yield put(setLoadingRegister(true));
  try {
    const response = yield call(verifyOtp, data);
    if (response) {
      yield put(setTokenStep(response.data.token));
    }
  } catch (error) {
    if (error.response.data) {
      toast.error(error.response.data.message);
      return;
    }
    yield put(showPopup());
  } finally {
    yield put(setLoadingRegister(false));
  }
}

export default function* registerSaga() {
  yield takeLatest(REGIST_EMAIL, doRegistEmail);
  yield takeLatest(VERIFY_OTP, doVerifyOtp);
  yield takeLatest(USER_REGISTER, doUserRegister);
}
