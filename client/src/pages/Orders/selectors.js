import { createSelector } from 'reselect';
import { initialState } from '@pages/Orders/reducer';

const selectOrdersState = (state) => state.orders || initialState;

export const selectOrders = createSelector(selectOrdersState, (state) => state.orders);
export const selectOrderSuccess = createSelector(selectOrdersState, (state) => state.orderSuccess);
