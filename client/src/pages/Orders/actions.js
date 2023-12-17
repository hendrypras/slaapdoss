import { CANCEL_TRANSCACTION, GET_ORDERS_USER, SET_LOADING, SET_ORDERS_USER } from '@pages/Orders/constants';

export const getOrdersUser = (orderId, page, limit) => ({
  type: GET_ORDERS_USER,
  orderId,
  page,
  limit,
});
export const setOrdersUser = (orders) => ({
  type: SET_ORDERS_USER,
  orders,
});
export const setLoading = (data) => ({
  type: SET_LOADING,
  data,
});
export const cancelTransaction = (orderId, cbSuccess) => ({
  type: CANCEL_TRANSCACTION,
  orderId,
  cbSuccess,
});
