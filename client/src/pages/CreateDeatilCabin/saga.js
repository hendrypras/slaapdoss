import { takeLatest, call, put } from 'redux-saga/effects';

import { getDetailLocation } from '@domain/api';

import { showPopup, setLoading } from '@containers/App/actions';

import { GET_DATAIL_LOCATION } from '@pages/CreateDeatilCabin/constants';
import { setDetailLocation } from './actions';

function* doGetDetailLocation({ lat, lng }) {
  yield put(setLoading(true));
  try {
    const response = yield call(getDetailLocation, lat, lng);
    if (response) {
      yield put(setDetailLocation(response?.display_name));
    }
  } catch (error) {
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoading(false));
  }
}

export default function* createDetailCabinSaga() {
  yield takeLatest(GET_DATAIL_LOCATION, doGetDetailLocation);
}
