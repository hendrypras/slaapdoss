import { createSelector } from 'reselect';
import { initialState } from '@pages/Orders/reducer';

const selectOrdersState = (state) => state.orders || initialState;

export const selectLoading = createSelector(selectOrdersState, (state) => state.loading);
export const selectOrders = createSelector(selectOrdersState, (state) => state.orders);
