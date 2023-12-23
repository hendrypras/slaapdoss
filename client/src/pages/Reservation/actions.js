import { CREATE_PAYMENT_RESERVATION, SELECT_PAYMENT_METHOD } from '@pages/Reservation/constants';

export const createPayment = (data, cbSuccess, cbErr) => ({
  type: CREATE_PAYMENT_RESERVATION,
  data,
  cbSuccess,
  cbErr,
});
export const selectPaymentMethod = (method) => ({
  type: SELECT_PAYMENT_METHOD,
  method,
});
