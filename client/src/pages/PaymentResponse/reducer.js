import { produce } from 'immer';

import { SET_LOADING, SET_ORDERS_USER } from '@pages/PaymentResponse/constants';

export const initialState = {
  loading: false,
  orders: {},
};

const paymentResponseReducer = (state = initialState, action) =>
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

export default paymentResponseReducer;
