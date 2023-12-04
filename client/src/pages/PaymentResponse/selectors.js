import { createSelector } from 'reselect';
import { initialState } from '@pages/PaymentResponse/reducer';

const selectPaymentResponseState = (state) => state.responsePayment || initialState;

export const selectLoading = createSelector(selectPaymentResponseState, (state) => state.loading);
export const selectResponsePayment = createSelector(selectPaymentResponseState, (state) => state.responsePayment);
