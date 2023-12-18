import {
  CANCEL_TRANSCACTION,
  GET_ORDERS_USER,
  GET_ORDER_SUCCESS,
  SET_ORDERS_USER,
  SET_ORDER_SUCCESS,
} from '@pages/Orders/constants';

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

export const cancelTransaction = (orderId, cbSuccess) => ({
  type: CANCEL_TRANSCACTION,
  orderId,
  cbSuccess,
});
export const getOrderSuccess = (orderId, cbError) => ({
  type: GET_ORDER_SUCCESS,
  orderId,
  cbError,
});
export const setOrderSuccess = (order) => ({
  type: SET_ORDER_SUCCESS,
  order,
});
