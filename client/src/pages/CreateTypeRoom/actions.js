import { CREATE_TYPE_ROOM } from '@pages/CreateTypeRoom/constants';

export const createTypeRoom = (data, cbSuccess) => ({
  type: CREATE_TYPE_ROOM,
  data,
  cbSuccess,
});
