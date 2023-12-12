import { produce } from 'immer';

import { SET_DATAIL_LOCATION, SET_DISPLAY_LOCATION } from '@pages/CreateDeatilCabin/constants';

export const initialState = {
  displayNameLocation: '',
  positionSelected: {
    lat: 0,
    lng: 0,
  },
};

const createDetailCabinReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_DISPLAY_LOCATION:
        draft.displayNameLocation = action.displayName;
        break;
      case SET_DATAIL_LOCATION:
        draft.positionSelected = action.selectedPosition;
        break;
    }
  });

export default createDetailCabinReducer;
