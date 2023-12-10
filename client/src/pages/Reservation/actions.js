import { CREATE_PAYMENT_RESERVATION, SELECT_PAYMENT_METHOD } from '@pages/Reservation/constants';

export const createPayment = (data, cbSuccess) => ({
  type: CREATE_PAYMENT_RESERVATION,
  data,
  cbSuccess,
});
export const selectPaymentMethod = (method) => ({
  type: SELECT_PAYMENT_METHOD,
  method,
});
