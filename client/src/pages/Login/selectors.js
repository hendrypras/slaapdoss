import { createSelector } from 'reselect';

import { initialState } from '@pages/Login/reducer';

const selectLoginState = (state) => state.login || initialState;

export const selectLoading = createSelector(selectLoginState, (state) => state.loading);
