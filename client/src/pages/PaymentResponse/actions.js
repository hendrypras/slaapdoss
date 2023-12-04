import { GET_RESPONSE_PAYMENT_BY_ORDER_ID, SET_LOADING, SET_RESPONSE_PAYMENT } from '@pages/PaymentResponse/constants';

export const getResponsePaymentById = (orderId) => ({
  type: GET_RESPONSE_PAYMENT_BY_ORDER_ID,
  orderId,
});
export const setResponsePayment = (data) => ({
  type: SET_RESPONSE_PAYMENT,
  data,
});
export const setLoading = (data) => ({
  type: SET_LOADING,
  data,
});
