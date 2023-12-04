import { createSelector } from 'reselect';

import { initialState } from '@pages/Register/reducer';

const selectLoginState = (state) => state.register || initialState;

export const selectLoading = createSelector(selectLoginState, (state) => state.loading);
export const selectTokenStep = createSelector(selectLoginState, (state) => state.tokenStep);
export const selectExpOtp = createSelector(selectLoginState, (state) => state.otpExp);
