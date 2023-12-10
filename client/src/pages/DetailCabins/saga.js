import { takeLatest, call, put } from 'redux-saga/effects';

import { getDetailCabins } from '@domain/api';

import { showPopup, setLoading } from '@containers/App/actions';

import { GET_DETAIL_CABINS } from '@pages/DetailCabins/constants';
import { setDetailCabin } from '@pages/DetailCabins/actions';

function* doGetDetailCabins({ data }) {
  yield put(setLoading(true));
  try {
    const response = yield call(getDetailCabins, data);
    if (response) {
      yield put(setDetailCabin(response?.data));
    }
  } catch (error) {
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoading(false));
  }
}

export default function* detailCabinsSaga() {
  yield takeLatest(GET_DETAIL_CABINS, doGetDetailCabins);
}
