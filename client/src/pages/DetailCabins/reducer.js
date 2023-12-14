import { produce } from 'immer';

import {
  ROOM_SELECTED_TO_PAYMENT,
  SET_CABINS_LOCATION,
  SET_DATAIL_CABINS,
  SET_DETAIL_ROOM_CABIN,
  SET_LOADING,
} from '@pages/DetailCabins/constants';

export const initialState = {
  cabins: null,
  loading: false,
  cabinsLocation: [],
  roomId: null,
  detailRoomCabin: null,
};

const detailCabinsReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_DATAIL_CABINS:
        draft.cabins = action.cabins;
        break;
      case SET_LOADING:
        draft.loading = action.loading;
        break;
      case SET_CABINS_LOCATION:
        draft.cabinsLocation = action.cabinsLocation;
        break;
      case ROOM_SELECTED_TO_PAYMENT:
        draft.roomId = action.roomId;
        break;
      case SET_DETAIL_ROOM_CABIN:
        draft.detailRoomCabin = action.data;
        break;
    }
  });

export default detailCabinsReducer;
