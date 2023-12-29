import { createSelector } from 'reselect';

import { initialState } from '@pages/EditTypeRoom/reducer';

const selectEditTypeRoomState = (state) => state.editTypeRoom || initialState;

export const selectDetailTypeRoom = createSelector(selectEditTypeRoomState, (state) => state.detailTypeRoom);
