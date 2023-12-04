import { createSelector } from 'reselect';

import { initialState } from '@pages/Home/reducer';

const selectHomeState = (state) => state.home || initialState;

export const selectLoading = createSelector(selectHomeState, (state) => state.loading);
