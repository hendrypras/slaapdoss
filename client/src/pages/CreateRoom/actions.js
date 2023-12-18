import { CREATE_ROOM } from '@pages/CreateRoom/constants';

export const createRoom = (data, cbSuccess) => ({
  type: CREATE_ROOM,
  data,
  cbSuccess,
});
