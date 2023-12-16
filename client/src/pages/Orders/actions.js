import { GET_ORDERS_USER, SET_LOADING, SET_ORDERS_USER } from '@pages/Orders/constants';

export const getOrdersUser = (orderId) => ({
  type: GET_ORDERS_USER,
  orderId,
});
export const setOrdersUser = (orders) => ({
  type: SET_ORDERS_USER,
  orders,
});
export const setLoading = (data) => ({
  type: SET_LOADING,
  data,
});
