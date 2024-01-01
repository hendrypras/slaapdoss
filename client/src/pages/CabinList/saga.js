import { takeLatest, call, put } from 'redux-saga/effects';

import { getCabins } from '@domain/api';

import { showPopup, setLoading } from '@containers/App/actions';

import { setAllCabin } from '@pages/CabinList/actions';
import { GET_ALL_CABIN } from '@pages/CabinList/constants';

function* doGetAllCabin({ slug, page, limit }) {
  yield put(setLoading(true));
  try {
    const response = yield call(getCabins, slug, page, limit);
    if (response) {
      yield put(setAllCabin(response.data));
    }
  } catch (error) {
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoading(false));
  }
}

export default function* cabinListSaga() {
  yield takeLatest(GET_ALL_CABIN, doGetAllCabin);
}
