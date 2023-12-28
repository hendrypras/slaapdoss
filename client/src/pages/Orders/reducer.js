import { produce } from 'immer';

import { SET_ORDERS_USER, SET_ORDER_DETAIL } from '@pages/Orders/constants';

export const initialState = {
  orders: null,
  orderDetail: null,
};

const ordersReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_ORDERS_USER:
        draft.orders = action.orders;
        break;
      case SET_ORDER_DETAIL:
        draft.orderDetail = action.order;
        break;
    }
  });

export default ordersReducer;
