import { createSelector } from 'reselect';

import { initialState } from '@pages/CreateTypeRoom/reducer';

const selectCreateTypeRoomState = (state) => state.createTypeRoom || initialState;

export const selectTypeRoom = createSelector(selectCreateTypeRoomState, (state) => state.typeRoom);
