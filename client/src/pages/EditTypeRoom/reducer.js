import { produce } from 'immer';

import { SET_DETAIL_TYPE_ROOM } from '@pages/EditTypeRoom/constants';

export const initialState = {
  detailTypeRoom: null,
};
const editTypeRoomReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_DETAIL_TYPE_ROOM:
        draft.detailTypeRoom = action.data;
        break;
    }
  });

export default editTypeRoomReducer;
