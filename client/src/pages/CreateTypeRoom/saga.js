import { takeLatest, call, put } from 'redux-saga/effects';

import { createCabin, getDetailLocation } from '@domain/api';

import { showPopup, setLoading } from '@containers/App/actions';

import { CREATE_CABIN, GET_DATAIL_LOCATION } from '@pages/CreateDeatilCabin/constants';
import { setDisplayLocation, setPosition } from '@pages/CreateDeatilCabin/actions';

function* doGetDetailLocation({ lat, lng }) {
  yield put(setLoading(true));
  try {
    const response = yield call(getDetailLocation, lat, lng);
    if (response) {
      yield put(setDisplayLocation(response?.display_name));
      yield put(setPosition({ lat, lng }));
    }
  } catch (error) {
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoading(false));
  }
}
function* doCreateCabins({ data, cbSuccess }) {
  yield put(setLoading(true));
  try {
    const response = yield call(createCabin, data);
    if (response) {
      cbSuccess();
    }
  } catch (error) {
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoading(false));
  }
}

export default function* createDetailCabinSaga() {
  yield takeLatest(GET_DATAIL_LOCATION, doGetDetailLocation);
  yield takeLatest(CREATE_CABIN, doCreateCabins);
}
