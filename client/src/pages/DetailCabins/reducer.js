import { produce } from 'immer';

import { SET_DATAIL_CABINS } from '@pages/DetailCabins/constants';

export const initialState = {
  cabins: null,
};

const detailCabinsReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_DATAIL_CABINS:
        draft.cabins = action.cabins;
        break;
    }
  });

export default detailCabinsReducer;
