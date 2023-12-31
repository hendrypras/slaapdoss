import { produce } from 'immer';

import { SET_ALL_CABIN } from '@pages/CabinList/constants';

export const initialState = {
  cabins: {
    results: [],
    count: 0,
  },
};
const cabinListReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_ALL_CABIN:
        draft.cabins = action.data;
        break;
    }
  });

export default cabinListReducer;
