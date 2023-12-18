import { takeLatest, call, put } from 'redux-saga/effects';

import { createRoom } from '@domain/api';

import { showPopup, setLoading } from '@containers/App/actions';

import { CREATE_ROOM } from '@pages/CreateRoom/constants';

function* doCreateRoom({ data, cbSuccess }) {
  yield put(setLoading(true));
  try {
    const response = yield call(createRoom, data);
    if (response) {
      cbSuccess();
    }
  } catch (error) {
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoading(false));
  }
}

export default function* createRoomSaga() {
  yield takeLatest(CREATE_ROOM, doCreateRoom);
}
