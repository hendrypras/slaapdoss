import { createSelector } from 'reselect';

import { initialState } from '@pages/ForgotPassword/reducer';

const selectResetPasswordState = (state) => state.resetPassword || initialState;

export const selectLoading = createSelector(selectResetPasswordState, (state) => state.loading);
