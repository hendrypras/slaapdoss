import { produce } from 'immer';

import { SET_DATAIL_LOCATION } from '@pages/CreateDeatilCabin/constants';

export const initialState = {
  displayNameLocation: '',
};

const createDetailCabinReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_DATAIL_LOCATION:
        draft.displayNameLocation = action.displayName;
        break;
    }
  });

export default createDetailCabinReducer;
