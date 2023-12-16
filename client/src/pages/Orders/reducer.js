import { produce } from 'immer';

import { SET_LOADING, SET_ORDERS_USER } from '@pages/Orders/constants';

export const initialState = {
  loading: false,
  orders: {},
};

const ordersReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_LOADING:
        draft.loading = action.data;
        break;
      case SET_ORDERS_USER:
        draft.orders = action.orders;
        break;
    }
  });

export default ordersReducer;
