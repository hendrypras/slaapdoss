import { createSelector } from 'reselect';

import { initialState } from '@pages/DetailCabins/reducer';

const selectDetailCabinsState = (state) => state.detailCabins || initialState;

export const selectCabins = createSelector(selectDetailCabinsState, (state) => state.cabins);
export const selectCabinsLocation = createSelector(selectDetailCabinsState, (state) => state.cabinsLocation);
export const selectLoading = createSelector(selectDetailCabinsState, (state) => state.loading);
export const selectDetailRoomCabin = createSelector(selectDetailCabinsState, (state) => state.detailRoomCabin);
