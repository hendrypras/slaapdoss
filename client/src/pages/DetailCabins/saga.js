import { takeLatest, call, put } from 'redux-saga/effects';

import { getCabinsLocation, getDetailCabinRoom, getDetailCabins } from '@domain/api';

import { showPopup } from '@containers/App/actions';

import { GET_CABINS_LOCATION, GET_DETAIL_CABINS, GET_DETAIL_ROOM_CABIN } from '@pages/DetailCabins/constants';
import {
  setCabinsLocation,
  setDetailCabin,
  setDetailRoomCabin,
  setLoading as setLoadingDetailCabins,
} from '@pages/DetailCabins/actions';

function* doGetDetailCabins({ slug, dateStart, dateEnd, cbSuccess }) {
  yield put(setLoadingDetailCabins(true));
  try {
    const response = yield call(getDetailCabins, slug, dateStart, dateEnd);
    if (response) {
      yield put(setDetailCabin(response?.data));
      cbSuccess && cbSuccess();
    }
  } catch (error) {
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoadingDetailCabins(false));
  }
}

function* doGetCabinsLocation() {
  yield put(setLoadingDetailCabins(true));
  try {
    const response = yield call(getCabinsLocation);
    if (response) {
      yield put(setCabinsLocation(response?.data));
    }
  } catch (error) {
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoadingDetailCabins(false));
  }
}

function* doGetDetailRoomCabin({ slug, roomId, cbError }) {
  yield put(setLoadingDetailCabins(true));
  try {
    const response = yield call(getDetailCabinRoom, slug, roomId);
    if (response) {
      yield put(setDetailRoomCabin(response?.data));
    }
  } catch (error) {
    if (error.status === 404) {
      cbError();
      return;
    }
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoadingDetailCabins(false));
  }
}

export default function* detailCabinsSaga() {
  yield takeLatest(GET_DETAIL_CABINS, doGetDetailCabins);
  yield takeLatest(GET_CABINS_LOCATION, doGetCabinsLocation);
  yield takeLatest(GET_DETAIL_ROOM_CABIN, doGetDetailRoomCabin);
}
