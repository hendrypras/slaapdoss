import { produce } from 'immer';

import { SET_LOADING, SET_ORDERS } from '@pages/OrdersAdmin/constants';

export const initialState = {
  loading: false,
  orders: {},
};

const ordersAdminReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_ORDERS:
        draft.orders = action.orders;
        break;
      case SET_LOADING:
        draft.loading = action.loading;
        break;
    }
  });

export default ordersAdminReducer;
