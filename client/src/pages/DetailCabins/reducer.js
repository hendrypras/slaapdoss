import { produce } from 'immer';

import {
  SET_CABINS_LOCATION,
  SET_DATAIL_CABINS,
  SET_DETAIL_ROOM_CABIN,
  SET_LOADING,
} from '@pages/DetailCabins/constants';

export const initialState = {
  cabins: null,
  loading: false,
  cabinsLocation: [],
  detailRoomCabin: null,
};

export const storedKey = ['cabinsLocation'];

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
      case SET_DETAIL_ROOM_CABIN:
        draft.detailRoomCabin = action.data;
        break;
    }
  });

export default detailCabinsReducer;
