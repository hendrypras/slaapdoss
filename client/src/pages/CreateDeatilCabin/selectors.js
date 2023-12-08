import { createSelector } from 'reselect';

import { initialState } from '@pages/CreateDeatilCabin/reducer';

const selectCreateDetailCabinState = (state) => state.createDetailCabin || initialState;

export const selectDisplayNameLocation = createSelector(
  selectCreateDetailCabinState,
  (state) => state.displayNameLocation
);
