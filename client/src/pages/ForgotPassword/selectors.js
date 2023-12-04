import { createSelector } from 'reselect';

import { initialState } from '@pages/ForgotPassword/reducer';

const selectForgotPasswordState = (state) => state.forgotPassword || initialState;

export const selectLoading = createSelector(selectForgotPasswordState, (state) => state.loading);
