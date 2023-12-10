import { createSelector } from 'reselect';

import { initialState } from '@pages/Reservation/reducer';

const selectReservationState = (state) => state.reservation || initialState;

export const selectMethod = createSelector(selectReservationState, (state) => state.method);
