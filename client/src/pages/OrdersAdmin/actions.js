import { GET_ORDERS, SET_LOADING, SET_ORDERS } from '@pages/OrdersAdmin/constants';

export const getOrders = (orderId, page, limit) => ({
  type: GET_ORDERS,
  orderId,
  page,
  limit,
});
export const setOrders = (orders) => ({
  type: SET_ORDERS,
  orders,
});
export const setLoading = (loading) => ({
  type: SET_LOADING,
  loading,
});
