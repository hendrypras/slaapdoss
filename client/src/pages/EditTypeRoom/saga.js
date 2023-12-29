import { takeLatest, call, put } from 'redux-saga/effects';

import { editTypeRoom, getTypeRoomById } from '@domain/api';

import { showPopup, setLoading } from '@containers/App/actions';

import { GET_TYPE_ROOM_BY_ID, EDIT_TYPE_ROOM } from '@pages/EditTypeRoom/constants';
import { setDetailTypeRoom } from '@pages/EditTypeRoom/actions';

function* doEditTypeRoom({ data, typeRoomId, cbSuccess }) {
  yield put(setLoading(true));
  try {
    const response = yield call(editTypeRoom, data, typeRoomId);
    if (response) {
      cbSuccess();
    }
  } catch (error) {
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoading(false));
  }
}
function* doGetTypeRoomById({ typeRoomId }) {
  yield put(setLoading(true));
  try {
    const response = yield call(getTypeRoomById, typeRoomId);
    if (response) {
      yield put(setDetailTypeRoom(response.data));
    }
  } catch (error) {
    yield put(showPopup(error.response.data.message));
  } finally {
    yield put(setLoading(false));
  }
}
export default function* editTypeRoomSaga() {
  yield takeLatest(EDIT_TYPE_ROOM, doEditTypeRoom);
  yield takeLatest(GET_TYPE_ROOM_BY_ID, doGetTypeRoomById);
}
