import { takeLatest, call, put } from 'redux-saga/effects';

import { createIdCard, getDataCredentialUser, getUserProfile, updateUserProfile, uploadIdCard } from '@domain/api';

import { showPopup, setLoading } from '@containers/App/actions';
import {
  setDataCrutialUser,
  setDataIdCard,
  setLoading as setLoadingUserProfile,
  setUserProfile,
} from '@pages/UserProfile/actions';
import {
  CREATE_ID_CARD,
  GET_DATA_CRUTIAL_USER,
  GET_USER_PROFILE,
  UPDATE_USER_PROFILE,
  UPLOAD_ID_CARD,
} from '@pages/UserProfile/constants';
import { decryptObjectPayload } from '@utils/decryptPayload';

function* doGetUserProfile() {
  yield put(setLoadingUserProfile(true));
  try {
    const response = yield call(getUserProfile);
    if (response) {
      yield put(setUserProfile(response.data));
    }
  } catch (error) {
    yield put(showPopup(error?.response?.data?.message));
  } finally {
    yield put(setLoadingUserProfile(false));
  }
}
function* doUploadIdCard({ imageUrl, cbError }) {
  yield put(setLoading(true));
  try {
    const response = yield call(uploadIdCard, imageUrl);
    if (response) {
      yield put(setDataIdCard(response?.data));
    }
  } catch (error) {
    cbError();
    yield put(showPopup(error?.response?.data?.message));
  } finally {
    yield put(setLoading(false));
  }
}
function* doCreateIdCard({ data, cbSuccess, cbError }) {
  yield put(setLoading(true));
  try {
    const response = yield call(createIdCard, data);
    if (response) {
      cbSuccess && cbSuccess();
    }
  } catch (error) {
    if (error.response.status === 409) {
      cbError();
    }
    yield put(showPopup(error?.response?.data?.message));
  } finally {
    yield put(setLoading(false));
  }
}
function* doGetDataCredential() {
  yield put(setLoading(true));
  try {
    const response = yield call(getDataCredentialUser);
    if (response) {
      const result = decryptObjectPayload(response?.data);
      yield put(setDataCrutialUser(result));
    }
  } catch (error) {
    yield put(showPopup(error?.response?.data?.message));
  } finally {
    yield put(setLoading(false));
  }
}

function* doUpdateUserProfile({ data, cbSuccess }) {
  yield put(setLoading(true));
  try {
    const response = yield call(updateUserProfile, data);
    if (response) {
      cbSuccess && cbSuccess();
    }
  } catch (error) {
    yield put(showPopup(error?.response?.data?.message));
  } finally {
    yield put(setLoading(false));
  }
}
export default function* userProfileSaga() {
  yield takeLatest(GET_USER_PROFILE, doGetUserProfile);
  yield takeLatest(UPLOAD_ID_CARD, doUploadIdCard);
  yield takeLatest(CREATE_ID_CARD, doCreateIdCard);
  yield takeLatest(GET_DATA_CRUTIAL_USER, doGetDataCredential);
  yield takeLatest(UPDATE_USER_PROFILE, doUpdateUserProfile);
}
