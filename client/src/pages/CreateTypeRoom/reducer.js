import { produce } from 'immer';

import { SET_TYPE_ROOM } from '@pages/CreateTypeRoom/constants';

export const initialState = {
  typeRoom: [],
};

const createTypeRoomReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_TYPE_ROOM:
        draft.typeRoom = action.typeRoom;
        break;
    }
  });

export default createTypeRoomReducer;
