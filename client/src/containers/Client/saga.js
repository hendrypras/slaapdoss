/* eslint-disable no-underscore-dangle */
import { takeLatest, call, put } from 'redux-saga/effects';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { login, logout, oAuthGoogle } from '@domain/api';

import { hidePopup, setLoading, showPopup } from '@containers/App/actions';
import { setLogin, setToken, setLoading as setLoadingLogin } from '@containers/Client/actions';
import { LOGOUT, OAUTH_GOOGLE, USER_LOGIN } from '@containers/Client/constants';

import { auth } from '@utils/firebase';

function* doOAuthGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = yield call(signInWithPopup, auth, provider);
    const firstName = result?._tokenResponse?.firstName;
    const email = result?._tokenResponse?.email;
    const image = result?._tokenResponse?.photoUrl;
    const response = yield call(oAuthGoogle, {
      username: firstName,
      image,
      email,
    });
    yield put(setLoading(true));
    if (response) {
      yield put(setLogin(true));
      yield put(setToken(response.data.token));
    }
  } catch (error) {
    yield put(showPopup(error?.response?.data?.message));
  } finally {
    yield put(setLoading(false));
  }
}
function* doUserLogin({ data, cb }) {
  yield put(setLoadingLogin(true));
  try {
    const response = yield call(login, data);
    if (response) {
      yield put(setLogin(true));
      yield put(setToken(response.data.token));
      cb();
    }
  } catch (error) {
    yield put(showPopup(error?.response?.data?.message));
  } finally {
    yield put(setLoadingLogin(false));
  }
}
function* doLogout({ cbError }) {
  yield put(setLoading(true));
  try {
    const response = yield call(logout);
    if (response) {
      localStorage.clear();
      yield put(hidePopup());
      window.location.href = '/';
    }
  } catch (error) {
    if (error.response.status === 401) {
      return cbError();
    }
    yield put(showPopup(error?.response?.data?.message));
  } finally {
    yield put(setLoading(false));
  }
}

export default function* clientSaga() {
  yield takeLatest(OAUTH_GOOGLE, doOAuthGoogle);
  yield takeLatest(USER_LOGIN, doUserLogin);
  yield takeLatest(LOGOUT, doLogout);
}
