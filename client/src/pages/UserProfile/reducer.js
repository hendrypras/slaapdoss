import { produce } from 'immer';

import {
  SET_DATA_CRUTIAL_USER,
  SET_DATA_ID_CARD,
  SET_IMAGE_CAPTURED,
  SET_LOADING,
  SET_USER_PROFILE,
} from '@pages/UserProfile/constants';

export const initialState = {
  userProfile: null,
  userData: null,
  loading: false,
  dataIdCard: null,
  imageCaptured: null,
};
export const storedKey = ['userProfile', 'dataIdCard'];

const userProfileReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_USER_PROFILE:
        draft.userProfile = action.profile;
        break;
      case SET_LOADING:
        draft.loading = action.loading;
        break;
      case SET_DATA_ID_CARD:
        draft.dataIdCard = action.data;
        break;
      case SET_DATA_CRUTIAL_USER:
        draft.userData = action.data;
        break;
      case SET_IMAGE_CAPTURED:
        draft.imageCaptured = action.image;
        break;
    }
  });

export default userProfileReducer;
