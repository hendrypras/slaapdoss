import { takeLatest, call, put } from 'redux-saga/effects';
import toast from 'react-hot-toast';

import { login, oAuthGoogle } from '@domain/api';

import { setLoading } from '@containers/App/actions';
import { setLogin, setToken } from '@containers/Client/actions';
import { setLoading as setLoadingLogin } from '@pages/Login/actions';

import { OAUTH_GOOGLE, USER_LOGIN } from '@pages/Login/constants';

function* doOAuthGoogle({ data }) {
  yield put(setLoading(true));
  try {
    const response = yield call(oAuthGoogle, data);
    if (response) {
      yield put(setLogin(true));
      yield put(setToken(response.data.token));
    }
  } catch (error) {
    toast.error(error.response.data.message || error.message);
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
    toast.error(error.response.data.message || error.message);
  } finally {
    yield put(setLoadingLogin(false));
  }
}

export default function* loginSaga() {
  yield takeLatest(OAUTH_GOOGLE, doOAuthGoogle);
  yield takeLatest(USER_LOGIN, doUserLogin);
}
