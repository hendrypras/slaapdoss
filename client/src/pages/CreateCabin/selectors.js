import { createSelector } from 'reselect';

import { initialState } from '@pages/CreateCabin/reducer';

const selectCreateDetailCabinState = (state) => state.createCabin || initialState;

export const selectDisplayNameLocation = createSelector(
  selectCreateDetailCabinState,
  (state) => state.displayNameLocation
);
export const selectPositionSelected = createSelector(selectCreateDetailCabinState, (state) => state.positionSelected);
