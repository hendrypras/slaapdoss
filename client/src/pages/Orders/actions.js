import {
  CANCEL_TRANSCACTION,
  GET_ORDERS_USER,
  GET_ORDER_SUCCESS,
  SET_ORDERS_USER,
  SET_ORDER_DETAIL,
} from '@pages/Orders/constants';

export const getOrdersUser = (orderId, page, limit, cbError) => ({
  type: GET_ORDERS_USER,
  orderId,
  page,
  limit,
  cbError,
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
export const getDetailOrder = (orderId, cbSuccess, cbError) => ({
  type: GET_ORDER_SUCCESS,
  orderId,
  cbSuccess,
  cbError,
});
export const setOrderDetail = (order) => ({
  type: SET_ORDER_DETAIL,
  order,
});
