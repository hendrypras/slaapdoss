import { produce } from 'immer';

import { SELECT_PAYMENT_METHOD } from '@pages/Reservation/constants';

export const initialState = {
  method: null,
};

const reservationReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SELECT_PAYMENT_METHOD:
        draft.method = action.method;
        break;
    }
  });

export default reservationReducer;
