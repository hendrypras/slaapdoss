import { EDIT_TYPE_ROOM, GET_TYPE_ROOM_BY_ID, SET_DETAIL_TYPE_ROOM } from '@pages/EditTypeRoom/constants';

export const editTypeRoom = (data, typeRoomId, cbSuccess) => ({
  type: EDIT_TYPE_ROOM,
  data,
  typeRoomId,
  cbSuccess,
});
export const getTypeRoomById = (typeRoomId, cbErr) => ({
  type: GET_TYPE_ROOM_BY_ID,
  typeRoomId,
  cbErr,
});
export const setDetailTypeRoom = (data) => ({
  type: SET_DETAIL_TYPE_ROOM,
  data,
});
