import { createSelector } from 'reselect';

import { initialState } from '@pages/CabinList/reducer';

const selectCabinListState = (state) => state.cabinList || initialState;

export const selectCabins = createSelector(selectCabinListState, (state) => state.cabins);
