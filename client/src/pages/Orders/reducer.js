import { produce } from 'immer';

import { SET_ORDERS_USER, SET_ORDER_SUCCESS } from '@pages/Orders/constants';

export const initialState = {
  orders: null,
  orderSuccess: {},
};

const ordersReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_ORDERS_USER:
        draft.orders = action.orders;
        break;
      case SET_ORDER_SUCCESS:
        draft.orderSuccess = action.order;
        break;
    }
  });

export default ordersReducer;
