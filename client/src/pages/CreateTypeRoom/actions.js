import { CREATE_TYPE_ROOM, GET_TYPE_ROOM, SET_TYPE_ROOM } from '@pages/CreateTypeRoom/constants';

export const createTypeRoom = (data, cbSuccess) => ({
  type: CREATE_TYPE_ROOM,
  data,
  cbSuccess,
});
export const getTypeRoom = () => ({
  type: GET_TYPE_ROOM,
});
export const setTypeRoom = (typeRoom) => ({
  type: SET_TYPE_ROOM,
  typeRoom,
});
