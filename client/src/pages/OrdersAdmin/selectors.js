import { createSelector } from 'reselect';
import { initialState } from '@pages/OrdersAdmin/reducer';

const selectOrdersAdminState = (state) => state.ordersAdmin || initialState;

export const selectOrdersAdmin = createSelector(selectOrdersAdminState, (state) => state.orders);
export const selectLoading = createSelector(selectOrdersAdminState, (state) => state.loading);
