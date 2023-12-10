import { createSelector } from 'reselect';

import { initialState } from '@pages/DetailCabins/reducer';

const selectDetailCabinsState = (state) => state.detailCabins || initialState;

export const selectCabins = createSelector(selectDetailCabinsState, (state) => state.cabins);
