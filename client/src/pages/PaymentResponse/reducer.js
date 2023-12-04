import { produce } from 'immer';

import { SET_RESPONSE_PAYMENT, SET_LOADING } from '@pages/PaymentResponse/constants';

export const initialState = {
  loading: false,
  responsePayment: {},
};

const paymentResponseReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_LOADING:
        draft.loading = action.data;
        break;
      case SET_RESPONSE_PAYMENT:
        draft.responsePayment = action.data;
        break;
    }
  });

export default paymentResponseReducer;
