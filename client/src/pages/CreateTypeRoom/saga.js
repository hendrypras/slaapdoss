import { takeLatest, call, put } from 'redux-saga/effects';

import { createTypeRoom } from '@domain/api';

import { showPopup, setLoading } from '@containers/App/actions';

import { CREATE_TYPE_ROOM } from '@pages/CreateTypeRoom/constants';

function* doCreateTypeRoom({ data, cbSuccess }) {
  yield put(setLoading(true));
  try {
    const response = yield call(createTypeRoom, data);
    if (response) {
      cbSuccess();
    }
  } catch (error) {
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoading(false));
  }
}

export default function* createTypeRoomSaga() {
  yield takeLatest(CREATE_TYPE_ROOM, doCreateTypeRoom);
}
