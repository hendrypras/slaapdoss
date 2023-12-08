import { createSelector } from 'reselect';

import { initialState } from '@pages/UserProfile/reducer';

const selectUserProfileState = (state) => state.userProfile || initialState;

export const selectUserProfile = createSelector(selectUserProfileState, (state) => state.userProfile);
export const selectDataIdCard = createSelector(selectUserProfileState, (state) => state.dataIdCard);
export const selectUserData = createSelector(selectUserProfileState, (state) => state.userData);
export const selectLoading = createSelector(selectUserProfileState, (state) => state.loading);
export const selectImageCaptured = createSelector(selectUserProfileState, (state) => state.imageCaptured);
